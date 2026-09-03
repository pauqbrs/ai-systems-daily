---
title: 'Citations te da el puntero exacto al documento, pero te obliga a partir el pipeline en dos'
date: 2026-09-03
section: datos-tokens
depth: analisis
readingMinutes: 3
tldr: 'La función citations de la API de Claude devuelve el fragmento literal que respalda cada afirmación, con página o índice de carácter, y no cobra ese texto como tokens de salida. El precio a pagar es que no puede convivir con structured outputs en la misma llamada.'
sources:
  - title: 'Citations'
    url: 'https://platform.claude.com/docs/en/build-with-claude/citations'
    author: 'Anthropic'
    platform: docs
tags: ['citations', 'extraccion-documental', 'trazabilidad', 'anthropic', 'pdf', 'arquitectura']
project: sistema-gestorias
projectTakeaway: 'Fija una decisión de arquitectura del andamiaje antes de escribir código: la extracción se parte en dos llamadas, una que ancla al documento y otra que estructura, y el troceado del documento pasa a ser configuración por tipo de documento en vez de una constante escondida.'
glossary:
  - term: citations
    definition: 'Una función de la API de Claude que hace que el modelo, además de responder, devuelva el fragmento exacto del documento de origen que respalda cada afirmación, con su localización dentro del documento.'
  - term: chunking
    definition: 'Trocear un documento en unidades más pequeñas. Aquí determina la granularidad mínima de una cita: si el troceado es por frases, la cita más pequeña posible es una frase.'
  - term: structured outputs
    definition: 'La función que obliga a la respuesta del modelo a cumplir un esquema JSON, restringiendo lo que puede generar en vez de pedírselo por prompt.'
  - term: cited_text
    definition: 'El campo de la respuesta que contiene el texto literal citado del documento. La documentación indica que no cuenta para los tokens de salida.'
  - term: custom content document
    definition: 'Un tipo de documento en el que tú entregas la lista de bloques ya troceada y la API no la vuelve a trocear, así que las citas apuntan a tus bloques.'
apply:
  - 'Antes de elegir el formato del documento, decide qué quieres poder señalar con el dedo delante de un cliente: si es «esta línea de esta tabla», el troceado por frases no te sirve y necesitas custom content documents.'
  - 'Mete en tu batería de pruebas un PDF que sea un escaneo sin capa de texto y comprueba qué hace tu pipeline: la documentación dice que esos PDF no son citables, así que tu sistema tiene que detectarlo y derivar a OCR, no fallar en silencio.'
  - 'Parte la extracción en dos llamadas: primera con citations activado para localizar y anclar los datos al documento, segunda con structured outputs para convertir esos hallazgos en el JSON que consume tu código. Activarlas juntas devuelve un 400.'
  - 'Aplica cache_control a los bloques de documento, no a la respuesta: las citas generadas no se cachean, pero los documentos que las originan sí.'
quiz:
  - question: 'Montas la extracción de facturas y quieres a la vez el JSON con los campos y la cita al documento de cada campo. Escribes una llamada con citations activado y output_config.format. ¿Qué ocurre?'
    options:
      - 'Funciona: las citas se añaden como un campo más del JSON.'
      - 'La API devuelve un error 400, porque citations y structured outputs son incompatibles.'
      - 'Funciona pero las citas llegan vacías.'
      - 'Funciona y el esquema JSON se ignora silenciosamente.'
    answer: 1
    explanation: 'La documentación es explícita: activar citations en cualquier documento del usuario junto con output_config.format devuelve un 400. El motivo es mecánico y merece entenderse, porque explica por qué no lo van a arreglar con un parche: las citas exigen intercalar bloques de cita con bloques de texto en la salida, y eso choca de frente con la restricción estricta de un esquema JSON. Por eso las dos opciones de «funciona pero a medias» son peores que el error: un fallo silencioso te dejaría publicando extracciones sin trazabilidad sin que nadie se entere. La solución no es un truco de prompt, es partir la llamada en dos.'
  - question: 'Tu cliente te enseña un albarán escaneado desde el móvil, sin capa de texto. ¿Qué hace la función citations con ese PDF?'
    options:
      - 'Lo cita por número de página, que es lo que hace con cualquier PDF.'
      - 'No es citable: solo hay citas de texto, y de ese PDF no se extrae texto.'
      - 'Lo cita devolviendo las coordenadas de la región de la imagen.'
      - 'Aplica OCR automáticamente antes de trocear.'
    answer: 1
    explanation: 'La documentación dice que las citas de imagen todavía no existen y que los PDF que son escaneos sin texto extraíble no son citables. Es exactamente el caso feo que decide si un andamiaje documental aguanta: la página existe y el modelo puede incluso describirte el contenido, pero no hay a qué anclar la cita. Ni hay OCR implícito ni coordenadas de imagen, así que ese paso tienes que ponerlo tú antes en el pipeline y saber en qué rama estás.'
  - question: 'Vienes de un sistema donde le pedías al modelo por prompt que copiara las citas literales en su respuesta. ¿Qué cambia en la factura al pasarte a citations?'
    options:
      - 'Sube el coste, porque las citas se cobran dos veces.'
      - 'Baja el coste de salida, porque cited_text no cuenta como tokens de salida, a cambio de una subida pequeña en los de entrada.'
      - 'No cambia nada: los mismos tokens con otro nombre.'
      - 'Baja el coste de entrada, porque el documento se envía troceado.'
    answer: 1
    explanation: 'Es el efecto contraintuitivo de esta función. Con el enfoque por prompt, cada cita literal que el modelo copia son tokens de salida que pagas, y la salida es la parte cara. Con citations el modelo emite internamente un formato compacto que la API expande, y el campo cited_text no cuenta como salida; al devolverlo en turnos posteriores tampoco cuenta como entrada. A cambio la documentación reconoce un ligero incremento en los tokens de entrada por las adiciones al system prompt y el troceado. El documento se envía igual, así que la entrada no baja.'
---

## El problema que resuelve, dicho en el idioma de una gestoría

Un pipeline documental que extrae el IVA de una factura y lo mete en el asiento tiene un agujero conocido: cuando el cliente pregunta «¿de dónde has sacado esta cifra?», la respuesta es la salida de un modelo. Sin puntero al documento, la revisión humana consiste en volver a leerlo todo, que es justo el trabajo que querías quitar.

La función `citations` de la API de Claude ataca eso: además de la respuesta, devuelve el fragmento literal que respalda cada afirmación y su posición exacta en el documento de origen.

## Cómo funciona, con precisión suficiente para replicarlo

Son tres pasos y una decisión importante escondida en el segundo.

**1. Marcas los documentos.** `citations.enabled = true` en cada bloque `document`. La documentación avisa de un detalle operativo: *«currently, citations must be enabled on all or none of the documents within a request»*. No hay término medio dentro de una misma llamada.

**2. La API trocea el documento.** Y aquí está la decisión, porque **el troceado define la granularidad mínima de la cita**:

| Tipo de documento | Troceado | Formato de la cita |
| --- | --- | --- |
| Texto plano | Por frases | Índices de carácter, base 0 |
| PDF | Por frases | Rango de páginas, base 1 |
| Custom content | Ninguno: se usan tus bloques tal cual | Índices de bloque, base 0 |

Si tu documento es prosa, el troceado por frases va bien. Si es una tabla de líneas de factura, una lista de asientos o una transcripción, trocear por frases produce citas inútiles: te señala una frase que cruza tres celdas. Para eso están los *custom content documents*, donde tú entregas los bloques ya hechos y la API no los vuelve a tocar.

**3. La respuesta llega intercalada.** Bloques de texto donde cada uno lleva su afirmación y la lista de citas que la sostienen, con el índice del documento del que salen.

## La restricción que decide tu arquitectura

Esta es la parte que hay que leer antes de diseñar nada, y no después:

> **Citations and structured outputs are incompatible.** [...] If you enable citations on any user-provided document [...] and also include the `output_config.format` parameter [...] the API returns a 400 error.

Y da el motivo, que es lo interesante: las citas necesitan intercalar bloques de cita con el texto, y eso es incompatible con las restricciones estrictas de esquema de los structured outputs.

O sea que **no puedes tener en la misma llamada el JSON garantizado y la trazabilidad al documento**. Justo las dos cosas que quiere un pipeline documental de gestoría.

La salida es partir en dos:

1. **Llamada de anclaje.** Documento con `citations` activado. Pides los hallazgos con su respaldo: base imponible, cuota, NIF del emisor, fecha, cada uno con su fragmento y su página.
2. **Llamada de estructura.** Sin documento, o con el documento ya reducido a los fragmentos citados. Aquí sí `output_config.format`, y lo que sale es el JSON que consume tu código.

Cuesta una llamada más, pero compra dos cosas: el JSON no depende de que el modelo se porte bien, y cada campo del JSON arrastra su cita. La segunda llamada, además, es barata: ya no lleva el documento entero.

## El modo de fallo que hay que probar el primer día

> As image citations are not yet supported, PDFs that are scans of documents and do not contain extractable text are not citable.

Traducido a la realidad de un despacho: la foto del ticket hecha con el móvil, el albarán escaneado del proveedor de siempre, el PDF que en realidad es una imagen dentro de un PDF. Nada de eso es citable. El modelo podrá describirte lo que ve, pero no hay texto al que apuntar.

Eso no es un defecto de la función, es una frontera de la que tiene que enterarse tu pipeline **antes** de procesar: detecta si el PDF tiene capa de texto y bifurca. Si no la tiene, o pasa por OCR y entra como texto plano, o entra por una rama donde sabes que no vas a poder ofrecer trazabilidad y avisas de ello.

## Lo que generaliza y lo que no

Encaja exactamente con el criterio del proyecto: al andamiaje se sube lo que se repite en todos los despachos, y a medida se queda lo que cambia.

- **Se generaliza:** la partición en dos llamadas, la detección de capa de texto, el cacheo de los bloques de documento con `cache_control`, y el formato de salida donde cada campo lleva su cita.
- **Se queda como configuración por cliente:** cómo se trocea cada tipo de documento. Que la factura de un proveedor concreto entre como custom content con un bloque por línea, y el contrato como texto plano, es una línea en un fichero de configuración, no una rama nueva del programa.

Que esa diferencia sea configuración y no código es literalmente lo que convierte cada despacho nuevo en horas en vez de semanas.
