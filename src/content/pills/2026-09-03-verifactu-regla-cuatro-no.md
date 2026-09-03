---
title: 'Verifactu no obliga a todos tus clientes: la regla de los 4 «NO» decide quién entra'
date: 2026-09-03
section: gestorias
depth: analisis
readingMinutes: 3
tldr: 'La AEAT define el ámbito de Verifactu con cuatro condiciones acumulativas, y una de ellas deja fuera a todo cliente acogido al SII. Vender la adaptación como obligación universal es vender algo que no es cierto para parte de la cartera.'
sources:
  - title: 'Preguntas frecuentes (FAQ) — Cuestiones generales: ámbitos de aplicación'
    url: 'https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu/preguntas-frecuentes/cuestiones-generales-ambitos-aplicacion.html'
    author: 'Agencia Tributaria (AEAT)'
    platform: docs
  - title: 'Real Decreto 1007/2023, de 5 de diciembre, por el que se aprueba el Reglamento que establece los requisitos de los sistemas informáticos de facturación'
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2023-24840'
    author: 'BOE'
    platform: docs
    publishedAt: 2023-12-06
  - title: 'Suministro Inmediato de Información (SII) — Información general'
    url: 'https://sede.agenciatributaria.gob.es/Sede/iva/suministro-inmediato-informacion/informacion-general.html'
    author: 'Agencia Tributaria (AEAT)'
    platform: docs
tags: ['gestorias', 'verifactu', 'sii', 'aeat', 'normativa', 'segmentacion']
project: auditoria-gestorias
projectTakeaway: 'Convierte el bloque 5 del entregable («estado de Verifactu») de una casilla genérica en un filtro de cuatro preguntas cerradas que segmenta la cartera del despacho antes de proponer nada, y que además le da al despacho un dato que probablemente no tiene ordenado.'
glossary:
  - term: SII
    definition: 'Suministro Inmediato de Información. El sistema por el que ciertos sujetos pasivos llevan los libros registro del IVA directamente en la sede electrónica de la AEAT, enviando el detalle de cada factura en pocos días en vez de presentar libros periódicos.'
  - term: RRSIF
    definition: 'Reglamento de los Requisitos de los Sistemas Informáticos de Facturación, aprobado por el Real Decreto 1007/2023. Es la norma que está detrás de lo que todo el mundo llama «Verifactu».'
  - term: SIF
    definition: 'Sistema Informático de Facturación. Cualquier programa que se use para expedir facturas, desde un ERP hasta una hoja de cálculo con plantilla, frente a la facturación puramente manual en papel.'
  - term: REDEME
    definition: 'Registro de Devolución Mensual del IVA. Quien se inscribe en él liquida el IVA mensualmente y, por eso mismo, queda obligado al SII.'
apply:
  - 'Añade cuatro columnas al inventario de clientes del despacho, una por cada «NO» de la regla: factura con SIF, está en SII, domicilio fiscal en País Vasco o Navarra, tiene resolución de no aplicación. El cruce de las cuatro te da la lista real de obligados.'
  - 'Cruza la cartera con el umbral del SII (facturación superior a 6 millones de euros, grupos de IVA, inscritos en REDEME): esos clientes salen del proyecto Verifactu y entran en otro distinto, porque su problema documental es el envío casi en tiempo real, no la inalterabilidad del registro.'
  - 'Separa las dos fechas en la propuesta: los clientes del Impuesto sobre Sociedades tienen que estar adaptados antes del 1 de enero de 2027; el resto, antes del 1 de julio de 2027. Son seis meses de diferencia que ordenan tu calendario de trabajo.'
  - 'Elimina de tus materiales comerciales cualquier mención a julio de 2026: esa fecha ya no está vigente y usarla delante de un cliente que se ha informado te cuesta la credibilidad de toda la propuesta.'
quiz:
  - question: 'Un cliente del despacho factura 9 millones de euros al año y está en el SII. Te pide presupuesto para adaptarse a Verifactu. ¿Qué le respondes?'
    options:
      - 'Que sí, y que además por su volumen le urge más que a los demás.'
      - 'Que no le aplica: estar adscrito al SII rompe la regla de los 4 «NO» y le deja fuera del RRSIF.'
      - 'Que le aplica igual, pero con el plazo largo del 1 de julio de 2027.'
      - 'Que le aplica solo a las facturas que emita fuera del SII.'
    answer: 1
    explanation: 'El artículo 3 del RD 1007/2023 excluye expresamente a quien lleva los libros registro por la vía del artículo 62.6 del Reglamento del IVA, que es el SII, y la AEAT lo recoge como el segundo de los cuatro «NO». El volumen no es un agravante sino justo lo contrario: es lo que le metió en el SII y por tanto lo que le saca de Verifactu. La opción del plazo largo confunde dos cosas distintas, porque las fechas solo importan una vez estás dentro del ámbito. Y la última opción inventa un régimen mixto que la norma no contempla: la exclusión se refiere a las operaciones documentadas por esa vía, no a un reparto factura a factura.'
  - question: 'Estás preparando la parte de Verifactu de una auditoría en un despacho con 120 clientes. ¿Cuál es el primer dato que pides?'
    options:
      - 'Qué software de facturación usa cada cliente.'
      - 'La facturación anual de cada cliente.'
      - 'La lista de clientes acogidos al SII y la de los que facturan exclusivamente a mano.'
      - 'Si alguno tiene domicilio fiscal en País Vasco o Navarra.'
    answer: 2
    explanation: 'Los dos primeros «NO» son los que más clientes mueven de una lista a otra, y son los que el despacho puede contestar en minutos porque los tiene en su propia gestión. El software importa después, cuando ya sabes quién está dentro y toca ver qué hay que cambiar. La facturación es un indicio del SII, pero no lo determina: REDEME y los grupos de IVA meten en el SII a empresas muy por debajo del umbral. Y el foral es un filtro real pero residual en la mayoría de carteras: preguntarlo primero ordena mal el trabajo.'
  - question: 'Un despacho te dice que sus clientes «ya están todos con software homologado, así que Verifactu está resuelto». ¿Qué comprueba tu auditoría?'
    options:
      - 'Nada más: si el software está homologado, el requisito se cumple.'
      - 'Que el software esté actualizado a la última versión.'
      - 'Que exista la declaración responsable del fabricante y que el despacho sepa qué clientes quedan fuera del ámbito, porque «todos» casi nunca es cierto.'
      - 'Que el software sea de un fabricante español.'
    answer: 2
    explanation: 'La obligación tiene dos lados: el reglamento se aplica también a productores y comercializadores de sistemas de facturación, así que el cumplimiento se acredita con lo que el fabricante declara, no con la palabra del despacho. Y «todos» es la afirmación que más a menudo se cae: en una cartera normal hay clientes en SII, clientes que facturan a mano y a veces algún foral. La versión del software es un detalle de implementación, y la nacionalidad del fabricante no es un criterio que aparezca en ningún sitio de la norma.'
---

## El error de partida

El argumento comercial más usado ahora mismo en el sector es «Verifactu llega en 2027 y afecta a todos tus clientes». La segunda mitad de esa frase es falsa, y la AEAT lo dice con una claridad poco habitual.

## Las cuatro condiciones, tal como las publica la AEAT

Están en las preguntas frecuentes oficiales, y la propia Agencia las bautiza como la **«regla de los 4 "NO"»**. El reglamento se aplica a empresarios y profesionales establecidos en territorio español que expidan facturas, *siempre y cuando cumplan las cuatro condiciones a la vez*:

| # | Condición | Qué deja fuera |
| --- | --- | --- |
| 1 | Que **NO** facturen exclusivamente de forma manual | Al que solo emite facturas en papel, sin ningún SIF |
| 2 | Que **NO** estén adscritos, de forma obligatoria o voluntaria, al SII | A todo el colectivo del SII |
| 3 | Que **NO** tengan domicilio fiscal en los Territorios Históricos del País Vasco o en la Comunidad Foral de Navarra | A los forales, que van por TicketBAI y su equivalente navarro |
| 4 | Que **NO** dispongan de una resolución en vigor de no aplicación | A quien tenga la exención concedida |

Son acumulativas: basta fallar una para quedar fuera. Y la segunda no es una interpretación amable, es el propio artículo 3 del Real Decreto 1007/2023: *«El presente Reglamento no se aplicará a los contribuyentes que lleven los libros registros en los términos establecidos en el apartado 6 del artículo 62»* del Reglamento del IVA. Ese apartado 62.6 es el SII.

## Por qué la segunda condición es la que mueve dinero

El SII es obligatorio, según la propia AEAT, para las grandes empresas —*facturación superior a 6 millones de €*—, los grupos de IVA y los inscritos en REDEME. En la cartera de un despacho mediano eso no es una anécdota: es justo el grupo de clientes que más factura, que más margen deja y al que más fácil resulta venderle un proyecto.

Y es precisamente el grupo al que **no** le puedes vender este proyecto.

Aquí es donde una auditoría bien hecha se separa de una hoja de cálculo genérica. El cliente grande no está exento de tener un problema documental; tiene otro distinto y probablemente mayor, porque el SII exige mandar el detalle de cada factura a la sede electrónica en plazos cortos. Pero es otro proyecto, con otro entregable y otro precio. Meterlo en el saco de Verifactu es la forma más rápida de que un cliente informado descubra que no dominas la norma.

## Las fechas, que también se cuentan mal

El propio real decreto separa dos plazos: los contribuyentes del Impuesto sobre Sociedades *«deberán tener adaptados los sistemas informáticos […] antes del 1 de enero de 2027»*, y el resto de obligados *«deberán tener operativos los citados sistemas informáticos antes del 1 de julio de 2027»*.

Seis meses de diferencia sobre dos subconjuntos distintos de la cartera. Para el despacho eso no es un matiz legal: es la diferencia entre un pico de trabajo imposible en diciembre de 2026 y dos oleadas planificables. Y para ti, que le vendes la automatización, es el argumento de por qué se empieza ahora y no en octubre.

Un aviso adicional: sigue circulando por internet la fecha de julio de 2026, que quedó derogada. Si aparece en tu material comercial, quítala.

## Lo que esto cambia en la auditoría

El bloque 5 del entregable —«estado de Verifactu y qué le queda al despacho»— deja de ser una casilla y pasa a ser una tabla de cuatro columnas booleanas sobre la cartera completa. Tiene tres virtudes prácticas:

1. **Se contesta rápido.** Las dos primeras columnas las tiene el despacho en su propia gestión.
2. **Produce un número.** «De tus 120 clientes, 94 están dentro del ámbito, y 31 de esos 94 vencen en enero de 2027.» Eso es una propuesta; «hay que adaptarse a Verifactu» no lo es.
3. **Es comparable entre despachos**, que es la métrica del proyecto. La misma tabla, con los mismos cuatro filtros, sale igual en el despacho siguiente.
