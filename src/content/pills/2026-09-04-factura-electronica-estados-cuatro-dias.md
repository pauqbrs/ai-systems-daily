---
title: 'La factura electrónica B2B no es una adaptación: es un reloj de cuatro días que arranca con cada factura recibida'
date: 2026-09-04
section: gestorias
depth: analisis
readingMinutes: 3
tldr: 'El RD 238/2026 obliga al receptor de cada factura a comunicar dos estados —aceptación o rechazo, y pago efectivo— en un plazo máximo de cuatro días desde que se producen. Eso no se resuelve cambiando de software: es un proceso diario nuevo en el despacho.'
sources:
  - title: 'Real Decreto 238/2026, de 25 de marzo, por el que se desarrolla el sistema de facturación electrónica obligatoria entre empresarios y profesionales'
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2026-7295'
    author: 'BOE'
    platform: docs
    publishedAt: 2026-03-31
  - title: 'Facturación electrónica obligatoria'
    url: 'https://sede.agenciatributaria.gob.es/Sede/todas-noticias/2026/marzo/31/facturacion-electronica-obligatoria.html'
    author: 'Agencia Tributaria (AEAT)'
    platform: docs
tags: ['gestorias', 'factura-electronica', 'normativa', 'aeat', 'plazos', 'formatos']
project: sistema-gestorias
projectTakeaway: 'Define la primera pieza del andamiaje que sirve en todos los despachos por igual: un normalizador de las cuatro sintaxis admitidas y una cola de estados con vencimiento a cuatro días. El formato de entrada cambia por cliente; el reloj y los dos estados obligatorios son idénticos en todos.'
glossary:
  - term: B2B
    definition: 'Business to business. Operaciones entre empresas o profesionales, por oposición a las que tienen como destinatario a un consumidor final.'
  - term: UBL
    definition: 'Universal Business Language. Un estándar internacional de documentos comerciales en XML. Es la sintaxis que usará la solución pública gratuita de la AEAT.'
  - term: CII
    definition: 'Cross Industry Invoice. El formato de factura electrónica en XML definido por UN/CEFACT, muy extendido en el comercio internacional.'
  - term: EDIFACT
    definition: 'Un estándar de intercambio electrónico de datos anterior al XML, todavía muy usado en la gran distribución y la automoción. Su mensaje de factura es uno de los formatos admitidos.'
  - term: Facturae
    definition: 'El formato XML de factura electrónica desarrollado en España, el que ya se usa obligatoriamente para facturar a las administraciones públicas.'
apply:
  - 'Cuenta las facturas RECIBIDAS al mes por cada cliente, no las emitidas. La obligación de informar estados recae sobre el destinatario, así que el volumen de trabajo nuevo se mide en el lado que casi nadie mira al hacer la propuesta.'
  - 'Monta el normalizador antes que nada: una función por sintaxis (CII, UBL, EDIFACT, Facturae) que devuelva la misma estructura interna. Es la pieza que se escribe una vez y sirve en todos los despachos, y sin ella cada cliente nuevo es un proyecto.'
  - 'Diseña la cola de estados con vencimiento explícito: cada factura recibida entra con dos plazos abiertos y un contador de cuatro días que excluye sábados, domingos y festivos nacionales. Sin cola con vencimiento no hay forma de saber qué se te ha pasado.'
  - 'El estado de pago no lo sabe el sistema documental, lo sabe la contabilidad o el banco. Traza ese enlace ahora: es la parte del flujo que no depende de leer la factura y la que más se olvida al presupuestar.'
quiz:
  - question: 'Un cliente recibe 400 facturas de proveedor al mes y emite 60. ¿Dónde está el trabajo nuevo que le trae el RD 238/2026?'
    options:
      - 'En las 60 que emite, porque hay que expedirlas en formato estructurado.'
      - 'En las 400 que recibe, porque de cada una hay que comunicar dos estados con plazo.'
      - 'En ninguna: el sistema lo hace automáticamente al ser electrónico.'
      - 'En las 60, y las 400 solo si se rechazan.'
    answer: 1
    explanation: 'El artículo 10.1 pone la obligación en los destinatarios de las facturas: son ellos quienes deben informar de la aceptación o rechazo comercial y del pago efectivo. Emitir en formato estructurado también cambia, pero es un cambio de una vez en el software; informar estados es un proceso recurrente que se dispara 400 veces al mes en este ejemplo. La tercera opción confunde el canal con el flujo de trabajo: que la factura viaje en XML no le dice a nadie si se ha aceptado ni cuándo se ha pagado. Y la cuarta se queda a medias: el pago efectivo hay que comunicarlo siempre, no solo cuando hay rechazo.'
  - question: 'Estás diseñando la cola de estados. Una factura se acepta el viernes por la tarde. ¿Cuándo vence el plazo para comunicarlo?'
    options:
      - 'El martes siguiente: cuatro días naturales contando sábado y domingo.'
      - 'El jueves siguiente: cuatro días que no cuentan sábados, domingos ni festivos nacionales.'
      - 'El lunes: el plazo se cuenta en horas hábiles.'
      - 'No hay plazo para la aceptación, solo para el pago.'
    answer: 1
    explanation: 'El artículo 10.3 dice literalmente «un plazo máximo de cuatro días naturales, excluyendo sábados, domingos y festivos nacionales». Es una redacción rara —dice naturales y luego descuenta el fin de semana— y precisamente por eso hay que implementarla al pie de la letra en vez de por intuición: un contador de días naturales puro te adelanta el vencimiento dos días y te hace incumplir sin saberlo. El plazo, además, corre desde que se produce cada estado, así que aceptación y pago tienen relojes independientes.'
  - question: 'El despacho te dice que sus clientes ya emiten en Facturae para la Administración, así que «esto ya lo tienen». ¿Qué comprueba tu diagnóstico?'
    options:
      - 'Nada más: Facturae es uno de los formatos admitidos.'
      - 'Que puedan RECIBIR y procesar las otras tres sintaxis admitidas, y que tengan resuelto de dónde sale el dato de pago.'
      - 'Que el proveedor de Facturae esté acreditado por la AEAT.'
      - 'Que migren a UBL, que es el formato de la solución pública.'
    answer: 1
    explanation: 'Emitir en un formato admitido resuelve una mitad del problema y la más fácil. El reglamento admite cuatro sintaxis, así que un cliente puede emitir en Facturae y recibir facturas en CII, UBL o EDIFACT según con quién trabaje: la parte que hay que construir es la de entrada. Y el segundo estado obligatorio, el pago efectivo, no sale de la factura en ningún formato: sale de la contabilidad o del banco. Migrar todo a UBL no es obligatorio, es una decisión de arquitectura, y las cuatro sintaxis siguen siendo válidas.'
---

## Lo que cambia, y por qué no se parece a Verifactu

Verifactu es un cambio de una vez: adaptas el software de facturación y el problema desaparece. Lo que trae el Real Decreto 238/2026, publicado en el BOE el 31 de marzo, es de otra naturaleza. No es un requisito sobre un programa: es **un proceso recurrente con plazo** que arranca cada vez que entra una factura.

Y arranca en el lado que casi nadie mira cuando prepara una propuesta: el de las facturas **recibidas**.

## Los dos estados obligatorios

El artículo 10.1 es explícito sobre quién tiene la obligación:

> Los destinatarios de facturas electrónicas deberán […] informar al obligado a expedir la factura electrónica de los siguientes estados de la factura: a) Aceptación o rechazo comercial de la factura y fecha en que se produce. b) Pago efectivo completo de la factura y su fecha efectiva de pago.

Dos estados, obligatorios, por cada factura recibida. El apartado 2 añade otros que son voluntarios —aceptación o rechazo parcial, pago parcial, cesión a un tercero— y que solo entran si la plataforma los soporta.

## El reloj, con su trampa de redacción

El artículo 10.3 fija el plazo:

> La información sobre los estados de la factura deberá remitirse en un plazo máximo de cuatro días naturales, excluyendo sábados, domingos y festivos nacionales, desde la fecha en que se produce el estado que se informa en cada caso.

Merece la pena leerlo dos veces, porque la redacción es contradictoria en apariencia: dice **naturales** y a continuación descuenta sábados, domingos y festivos nacionales. Quien lo implemente de memoria pondrá un contador de días naturales puro y se comerá el fin de semana, adelantando el vencimiento dos días. Es un fallo silencioso: nadie se entera hasta que la comunicación llega tarde.

Fíjate también en el final: el plazo corre *desde la fecha en que se produce el estado que se informa en cada caso*. No hay un reloj por factura, hay **dos relojes independientes**: uno que arranca al aceptar y otro que arranca al pagar, que pueden estar separados por sesenta días.

## Cuatro sintaxis, no una

El artículo 7.1 admite cuatro formatos: **CII**, **UBL**, el mensaje de factura **EDIFACT** y **Facturae**. La solución pública gratuita de la AEAT trabajará en UBL, y la Agencia se compromete a tenerla disponible *al menos dos meses antes de la primera aplicación efectiva*.

Esto es lo que decide el diseño del andamiaje. Un cliente puede emitir en Facturae porque ya factura a la Administración, y recibir en EDIFACT de un proveedor de la gran distribución y en UBL de otro. La entrada es heterogénea por cliente; el proceso posterior es idéntico para todos.

Traducción a arquitectura: **un normalizador por sintaxis, y de ahí para adentro una sola estructura**. Cuatro funciones que se escriben una vez y sirven en todos los despachos. Si en vez de eso el formato se cuela en la lógica del pipeline, cada cliente nuevo con un proveedor raro es una rama nueva del programa, que es exactamente lo que el proyecto existe para evitar.

## Cuándo

La aplicación efectiva va en dos fases contadas desde la entrada en vigor de la orden ministerial que regule la solución pública: **doce meses** para quienes superaron los 8 millones de euros de volumen de operaciones el año anterior, y **veinticuatro meses** para el resto.

Que las fechas concretas dependan de una orden ministerial todavía por publicar es un dato a usar con criterio delante de un cliente: cualquiera que hoy te dé una fecha exacta se la está inventando. Lo que sí es firme es la secuencia —primero los grandes, un año después los demás— y, sobre todo, la mecánica de los dos estados y los cuatro días, que no depende de ninguna orden pendiente.

## Lo que se generaliza y lo que no

Este reglamento parte el problema justo por donde el proyecto quiere que se parta:

- **Va al núcleo:** las cuatro sintaxis de entrada, la cola de estados con vencimiento, el cálculo del plazo con su descuento de fines de semana y festivos nacionales, y los dos estados obligatorios. Son idénticos en todos los despachos porque los fija una norma, no el criterio del cliente.
- **Se queda a medida:** de dónde sale el dato de pago en cada despacho —contabilidad, extracto bancario, confirmación manual— y qué se considera rechazo comercial en cada negocio.

Cuando el legislador te dice cuál es la parte común, hazle caso. No vas a encontrar una frontera mejor dibujada.
