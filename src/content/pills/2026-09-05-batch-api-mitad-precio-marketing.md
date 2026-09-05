---
title: 'La mitad de tu embudo no necesita respuesta inmediata, y esa mitad cuesta la mitad'
date: 2026-09-05
section: datos-tokens
depth: pill
readingMinutes: 2
tldr: 'La Message Batches API cobra el 50% del precio estándar a cambio de asincronía: hasta 100.000 peticiones por lote, la mayoría en menos de una hora. El inbound no cabe ahí; la generación de contenido de marca, sí.'
sources:
  - title: 'Batch processing'
    url: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing'
    author: 'Anthropic'
    platform: docs
tags: ['batch', 'coste', 'marketing', 'asincronia', 'prompt-caching', 'anthropic']
project: customlab
projectTakeaway: 'Parte el embudo por latencia y no por dificultad: todo lo que se genera por adelantado —piezas de marca, variantes de producto, textos de catálogo— sale al 50%, y el presupuesto que libera es el que financia dar respuesta rápida al inbound.'
glossary:
  - term: batch
    definition: 'Un lote de peticiones que se envían juntas y se procesan de forma asíncrona, sin esperar la respuesta de cada una en el momento.'
  - term: custom_id
    definition: 'La etiqueta que tú pones a cada petición dentro del lote. Es la única forma fiable de emparejar cada resultado con su petición, porque los resultados no vuelven en orden.'
  - term: throughput
    definition: 'Cuántas peticiones puedes procesar por unidad de tiempo. Es la métrica que mejora el batch, a costa de la latencia de cada una.'
apply:
  - 'Haz una lista de todo lo que hoy generas llamando a la API una a una y que nadie está esperando delante de una pantalla: descripciones de producto, variantes de un texto de campaña, textos de catálogo, reclasificaciones del histórico. Eso es tu lote.'
  - 'Pon un custom_id con significado a cada petición (SKU, id de campaña, id de lead) y empareja siempre por ese campo: la documentación avisa de que los resultados pueden volver en cualquier orden.'
  - 'Si las peticiones del lote comparten un bloque grande de contexto —tu guía de voz de marca—, usa la duración de caché de 1 hora: los lotes tardan más de los 5 minutos de la caché por defecto.'
  - 'Deja fuera del lote el inbound. Un lote puede tardar hasta 24 horas y expirar; responder a un cliente en minutos no es un caso de uso asíncrono por mucho que ahorre.'
quiz:
  - question: 'Mandas un lote de 3.000 descripciones de producto y emparejas los resultados por su posición en la lista de entrada. ¿Qué pasa?'
    options:
      - 'Funciona: los resultados vuelven en el orden en que se enviaron.'
      - 'Se mezclan: los resultados pueden volver en cualquier orden y hay que emparejar por custom_id.'
      - 'Funciona solo si el lote se completa en menos de una hora.'
      - 'La API devuelve un error si no incluyes el orden.'
    answer: 1
    explanation: 'La documentación lo marca como aviso destacado: los resultados pueden volver en cualquier orden y no tienen por qué coincidir con el de creación, así que hay que usar el custom_id para casarlos. Es un fallo silencioso y caro: no da error, simplemente cada producto acaba con la descripción de otro, y lo descubres en la web. El tiempo de proceso no cambia nada del orden. Y la API no exige el orden porque el custom_id es obligatorio en cada petición: ese es el mecanismo previsto.'
  - question: 'Tienes 40.000 peticiones que comparten un bloque grande con tu guía de voz de marca. ¿Qué haces con la caché?'
    options:
      - 'Nada: en batch la caché no funciona.'
      - 'Usar la duración de caché de 1 hora, porque un lote puede tardar más que los 5 minutos por defecto.'
      - 'Precalentar la caché con una petición de max_tokens 0 dentro del lote.'
      - 'Partir el lote en trozos de 5 minutos.'
    answer: 1
    explanation: 'La documentación recomienda exactamente eso: como los lotes pueden tardar más de 5 minutos, conviene la caché de 1 hora para mejorar la tasa de acierto cuando las peticiones comparten contexto. Sí funciona la caché en batch, pero con un matiz importante que la propia documentación reconoce: como las peticiones se procesan concurrentemente y en cualquier orden, los aciertos de caché se dan «best-effort». El precalentado con max_tokens 0 está expresamente prohibido dentro de un lote. Y trocear el lote no sirve: pierdes throughput sin resolver la caducidad.'
---

## El problema

Cuando el coste por conversación se convierte en la métrica del negocio, la tentación es apretar todas las rutas por igual. Pero un embudo de merchandising tiene dos mitades con exigencias opuestas: una que se juega los minutos —el mensaje que entra por formulario o WhatsApp— y otra a la que **nadie está esperando delante de una pantalla**: las descripciones de producto, las variantes de una campaña, los textos de catálogo, una reclasificación del histórico de leads.

Esa segunda mitad está pagando precio de urgencia sin necesitarla.

## Cómo funciona

La Message Batches API procesa lotes de forma asíncrona: mandas todas las peticiones juntas, consultas el estado, y recoges los resultados cuando terminan. Los números, tal como los publica la documentación:

| | |
| --- | --- |
| Descuento | *«All usage is charged at 50% of the standard API prices»* |
| Tamaño máximo | 100.000 peticiones o 256 MB, lo que se alcance antes |
| Tiempo típico | La mayoría de lotes, en menos de 1 hora |
| Tope duro | Resultados accesibles al terminar o a las 24 horas, lo que llegue antes; **el lote expira si no completa en 24 horas** |
| Conservación | Los resultados quedan disponibles 29 días desde la creación |

Un detalle a favor: las peticiones expiradas no se facturan. Y otro en contra que hay que diseñar desde el principio: **los resultados vuelven en cualquier orden**. La documentación es explícita —*«Batch results can be returned in any order»*— y la solución es el `custom_id`, obligatorio en cada petición, de 1 a 64 caracteres.

Tres parámetros no se admiten dentro de un lote y devuelven error de validación: `stream: true` (los resultados llegan como un fichero, no como un flujo), `speed` del modo rápido (ajusta latencia síncrona, que aquí no aplica) y `max_tokens: 0`.

## Por qué te importa

El reparto para tu embudo se escribe solo, y no va por dificultad sino por **quién está esperando**:

- **Síncrono, a precio completo**: cualificar el mensaje que acaba de entrar, la confirmación del brief con el cliente. Aquí manda el minuto.
- **Batch, a mitad de precio**: generar las piezas de marketing de la semana, producir las variantes de un texto por canal, reprocesar el catálogo cuando cambias la guía de voz, evaluar tu propio clasificador contra el histórico.

Ese último caso es el que más se pasa por alto. Medir si tu cualificador sigue acertando exige pasarle cientos de mensajes reales, y esa evaluación es asíncrona por definición: sale a mitad de precio, lo que convierte «medir cada semana» en algo que se puede permitir.

Un apunte sobre la caché, porque las dos cosas se combinan mal si no lo sabes. Si todas las piezas comparten tu guía de voz de marca en el prompt, quieres cacheársela; pero un lote tarda más que los cinco minutos de la caché por defecto, así que la documentación recomienda la duración de **1 hora**. Aun así los aciertos son *best-effort*: las peticiones se procesan concurrentemente y en cualquier orden, y eso la propia documentación lo reconoce. Cuenta con el 50% seguro, y con la caché como propina.
