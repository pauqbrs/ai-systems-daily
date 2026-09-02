---
title: 'Qué automatizar primero en una gestoría, según las horas que devuelve cada proceso'
date: 2026-09-01
section: gestorias
depth: analisis
readingMinutes: 3
tldr: 'Un despacho de 4-10 personas recupera entre 20 y 40 horas al mes automatizando dos o tres procesos de back-office. Los cuatro candidatos están identificados, y Verifactu en 2027 le pone fecha de caducidad a seguir sin hacerlo.'
sources:
  - title: 'Automatizar el back-office de una asesoría o gestoría con IA en 2026'
    url: 'https://www.javadex.es/blog/automatizar-asesoria-gestoria-ia-backoffice-2026'
    author: 'Javadex'
    platform: blog
tags: ['gestorias', 'ocr', 'conciliacion', 'verifactu', 'roi']
project: auditoria-gestorias
projectTakeaway: 'Da el esqueleto de los cinco bloques que tiene que producir la auditoría, y el umbral que ordena la propuesta: horas facturables recuperadas, no dificultad técnica.'
glossary:
  - term: OCR
    definition: 'Optical Character Recognition. Leer texto de una imagen o un PDF escaneado. Es el primer paso de cualquier automatización documental, y hoy va acompañado de un modelo que además interpreta lo que ha leído.'
  - term: back-office
    definition: 'Todo lo que el cliente no ve: registro de facturas, conciliación, archivo, preparación de modelos. Es donde se van las horas y donde no se factura.'
  - term: Verifactu
    definition: 'El sistema de facturación verificable de la AEAT. Obliga a que el software de facturación registre y encadene cada factura de forma inalterable. Obligatorio para empresas del Impuesto de Sociedades desde enero de 2027 y para autónomos desde julio de 2027.'
apply:
  - 'Antes de proponer nada, mide: pide al despacho el número de facturas de entrada al mes y las horas dedicadas a registrarlas. Sin ese número no hay caso de negocio, solo entusiasmo.'
  - 'Empieza por entrada y registro de facturas. Es el proceso con más volumen, más repetitivo y más fácil de medir, y por tanto el que mejor demuestra el valor en la primera semana.'
  - 'Define el umbral de confianza a partir del cual el sistema NO decide solo. Con precisiones del 95% en facturas estándar, ese 5% mal gestionado destruye la confianza del despacho más rápido de lo que el 95% la construye.'
  - 'Usa Verifactu 2027 como argumento de urgencia, no como amenaza: quien ordene ahora su gestión documental llega a la obligación con el trabajo hecho.'
quiz:
  - question: 'Entras en un despacho de 6 personas para hacer una auditoría rápida. ¿Cuál es el primer dato que necesitas?'
    options:
      - 'Qué software contable usan.'
      - 'El volumen mensual de cada proceso repetitivo y las horas que le dedican.'
      - 'Si el equipo tiene experiencia con IA.'
      - 'El presupuesto disponible.'
    answer: 1
    explanation: 'Volumen por horas es lo que convierte una automatización en un caso de negocio. El software importa para la implementación, no para la priorización: si el registro de facturas son 30 horas al mes y la atención a dudas repetidas son 4, el orden está decidido antes de saber si usan A3 o Holded.'
  - question: 'Un flujo de OCR + IA extrae los datos de factura con más del 95% de precisión en facturas estándar. ¿Cómo diseñas el sistema con ese dato?'
    options:
      - 'Automatizas al 100%: el 5% restante es un margen de error aceptable.'
      - 'Con un umbral de confianza: por encima entra directo, por debajo va a una cola de revisión humana.'
      - 'Dejas que un humano revise todas las facturas igualmente.'
      - 'Descartas el OCR hasta que llegue al 99,9%.'
    answer: 1
    explanation: 'Ni automatización ciega ni revisión total. Un umbral de confianza convierte el 5% de incertidumbre en una cola de trabajo pequeña y explícita, en lugar de en errores repartidos silenciosamente por la contabilidad. Es también lo que hace el sistema vendible: el despacho conserva el control sobre los casos dudosos.'
  - question: 'Un proyecto de back-office ronda los 5.000-12.000 € y se amortiza si recupera ≥15 horas/mes de trabajo facturable. ¿Qué implica esto para tu propuesta?'
    options:
      - 'Que hay que empezar por el proceso más impresionante técnicamente.'
      - 'Que la propuesta debe ir ordenada por horas recuperadas, no por dificultad técnica.'
      - 'Que solo merece la pena en despachos grandes.'
      - 'Que hay que cobrar por horas y no por proyecto.'
    answer: 1
    explanation: 'El umbral de amortización está expresado en horas recuperadas, así que ese es el eje de ordenación de la propuesta. Un proceso vistoso que devuelve 3 horas al mes no paga el proyecto; uno aburrido que devuelve 25, sí. La auditoría existe precisamente para producir esa lista ordenada.'
---

## Los cuatro procesos que concentran las horas

No hay que descubrir nada: en una asesoría o gestoría, las horas se van casi siempre por los mismos cuatro desagües.

1. **Entrada y registro de facturas.** El de más volumen y el más mecánico.
2. **Conciliación bancaria.** Cuadrar movimientos con asientos, uno a uno.
3. **Clasificación de documentos.** Decidir qué es cada PDF que llega y dónde va.
4. **Respuestas a dudas repetidas de clientes.** Las mismas quince preguntas cada trimestre.

La cifra que ordena la conversación: **un despacho de 4 a 10 personas recupera típicamente entre 20 y 40 horas al mes** automatizando dos o tres de estos. No los cuatro. Dos o tres.

## La aritmética del proyecto

Un proyecto de automatización de back-office se mueve en el rango de **5.000 a 12.000 €** y se amortiza en meses si recupera **15 horas o más al mes de trabajo facturable**.

Ese "facturable" hace mucho trabajo en esa frase. Ahorrar horas de una tarea que el despacho no factura mejora la vida del equipo pero no el balance. Ahorrar horas que el despacho puede reinvertir en asesoramiento sí. **Al priorizar, la pregunta no es "cuánto tiempo se tarda" sino "en qué se emplearía ese tiempo si se liberase".**

## Lo que ya hace la tecnología, y lo que no

Un flujo de OCR + IA extrae emisor, importe, fecha, concepto e IVA con **más de un 95% de precisión en facturas estándar** y lo registra en el software contable. Las herramientas del mercado español —Holded, Sage, Contasol, A3 Asesor— ya integran funciones que recortan entre un 60% y un 80% del tiempo de las tareas mecánicas.

Dos consecuencias, y la segunda es la importante:

- No estás vendiendo el OCR. El OCR es una commodity. Estás vendiendo **el flujo completo**: qué pasa con el 5% dudoso, cómo se revisa, cómo se aprende de la corrección y cómo se conecta con el software que ya usan.
- "Facturas estándar" es la letra pequeña. Los albaranes escaneados torcidos, los tickets térmicos borrados y las facturas de proveedores con maquetación creativa son el caso real, y son la razón por la que un umbral de confianza no es opcional.

## El reloj de Verifactu

Verifactu es obligatorio para empresas del Impuesto de Sociedades desde **enero de 2027** y para autónomos desde **julio de 2027**.

Esto convierte una venta consultiva difícil ("deberíais modernizaros") en una con fecha en el calendario: quien ordene ahora su gestión documental llega a la obligación con la adaptación prácticamente resuelta. Quien lo deje, se comerá la migración y la adaptación normativa a la vez, en el peor momento posible.

## Para tu sistema de auditoría

Aquí está el esqueleto de lo que debería producir tu auditoría rápida, y sale directamente de lo anterior:

1. **Inventario de procesos** con volumen mensual y horas dedicadas a cada uno.
2. **Clasificación** de cada proceso en mecánico (automatizable hoy), de criterio (asistible) o de relación (no tocar).
3. **Estimación de horas recuperables** por proceso, distinguiendo facturables de no facturables.
4. **Orden de ataque**: los dos o tres que superan el umbral de amortización, y ninguno más en la primera fase.
5. **Nota de Verifactu**: en qué punto está el despacho y qué le queda por hacer antes de 2027.

Ese entregable se puede generar con un agente. Y la parte de "inventario con volumen y horas" es exactamente el tipo de entrevista estructurada que un modelo conduce bien: preguntas fijas, respuestas numéricas, un cálculo determinista al final.
