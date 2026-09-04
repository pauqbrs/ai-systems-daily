---
title: 'Effort es la palanca de coste que no te obliga a cambiar de modelo, y choca de frente con la caché'
date: 2026-09-04
section: datos-tokens
depth: pill
readingMinutes: 2
tldr: 'Un parámetro, cinco niveles, y afecta a todos los tokens de salida: texto, llamadas a tools y thinking. El detalle que rompe sistemas: cambiar el effort de nivel superior entre peticiones invalida el prompt cache de esa conversación.'
sources:
  - title: 'Effort'
    url: 'https://platform.claude.com/docs/en/build-with-claude/effort'
    author: 'Anthropic'
    platform: docs
tags: ['effort', 'coste', 'latencia', 'prompt-caching', 'clasificacion', 'anthropic']
project: customlab
projectTakeaway: 'Separa el embudo en dos regímenes de coste sin tocar el modelo: la cualificación de un mensaje de inbound es trabajo de effort bajo, y la propuesta que se le manda al cliente no. Y avisa de la trampa: variar el nivel dentro de una misma conversación cacheada tira la caché.'
glossary:
  - term: effort
    definition: 'Un parámetro de la API de Claude que regula cuántos tokens gasta el modelo en responder, cambiando el equilibrio entre profundidad y coste sin cambiar de modelo.'
  - term: thinking
    definition: 'El razonamiento que el modelo produce antes de responder. Se factura como tokens de salida aunque no se muestre.'
  - term: prompt cache
    definition: 'La parte del prompt que el proveedor guarda entre llamadas para no cobrarla entera cada vez. Funciona por prefijo: coincide desde el principio hasta donde deja de coincidir.'
apply:
  - 'Clasifica cada ruta de tu embudo por lo que necesita de verdad: cualificar un mensaje de formulario es una tarea acotada; redactar la propuesta no. Asigna effort por ruta, no un valor global para toda la aplicación.'
  - 'Fija el nivel explícitamente aunque quieras el de por defecto. La documentación recomienda ponerlo siempre, y así el día que alguien lo toque se verá en el diff en vez de en la factura.'
  - 'Elige un effort al principio de cada conversación cacheada y no lo muevas: cambiar el valor de nivel superior entre peticiones invalida los prefijos cacheados de los turnos anteriores.'
  - 'Antes de bajar el nivel en una ruta, pásale tus casos reales de mensajes mal escritos y mide. La documentación no publica cifras de ahorro ni de pérdida de calidad: eso lo tienes que medir tú con tus datos.'
quiz:
  - question: 'Tu clasificador de inbound corre con prompt caching sobre el bloque de instrucciones y ejemplos. Decides bajar el effort de high a low para abaratarlo. ¿Qué pasa la primera vez?'
    options:
      - 'Ahorras en tokens de salida y la caché sigue funcionando igual.'
      - 'Ahorras en salida, pero el cambio del valor de nivel superior invalida los prefijos cacheados de esa conversación.'
      - 'No ahorras nada: effort solo afecta al thinking, y tú no lo tienes activado.'
      - 'La petición devuelve un error porque effort y prompt caching son incompatibles.'
    answer: 1
    explanation: 'La documentación dice que el effort de nivel superior da forma al prompt renderizado, así que cambiarlo entre peticiones no conserva los prefijos cacheados de turnos anteriores, y recomienda mantenerlo constante dentro de una conversación que dependa de la caché. El ahorro en salida es real, pero si lo pagas re-escribiendo la caché en una conversación larga, el balance puede salirte al revés el primer día. Que solo afecte al thinking es falso: la documentación dice expresamente que afecta a todos los tokens de la respuesta, incluidas las llamadas a tools. Y no son incompatibles: conviven, solo que el cambio cuesta.'
  - question: 'Tienes un agente con tools que a effort high hace ocho llamadas por conversación. Bajas a low. ¿Qué esperas ver, además del ahorro?'
    options:
      - 'El mismo número de llamadas, solo que con menos texto alrededor.'
      - 'Menos llamadas y más combinadas, y menos preámbulo antes de actuar.'
      - 'Más llamadas, porque el modelo compensa pensando menos.'
      - 'Ninguna diferencia: effort no toca el comportamiento con tools.'
    answer: 1
    explanation: 'La documentación es concreta sobre esto: a menor effort el modelo combina operaciones en menos llamadas, hace menos llamadas, va directo a la acción sin preámbulo y confirma de forma escueta. Es el efecto que más sorprende, porque no es solo verbosidad: cambia la estrategia de uso de tools. Y por eso una bajada de effort hay que probarla contra tu flujo real: en un agente que necesita comprobar tres cosas antes de decidir, «menos llamadas» puede significar que deja de comprobar una.'
---

## El problema

Cuando el coste por conversación se te va, el reflejo es cambiar de modelo. Es una decisión gruesa: cambias capacidad, tokenizador y espacio de caché a la vez, y además cada modelo tiene su propio espacio de caché, así que una cascada de dos modelos renuncia a reutilizar la del otro.

`effort` es la palanca fina: el mismo modelo, gastando menos.

## Cómo funciona

Va en la petición, dentro de `output_config`:

```json
{ "output_config": { "effort": "medium" } }
```

Cinco niveles —`low`, `medium`, `high`, `xhigh`, `max`—, con `high` por defecto: *«Setting `effort` to `"high"` produces exactly the same behavior as omitting the `effort` parameter entirely»*.

Lo importante es su alcance. No es un tope de tokens ni un interruptor del razonamiento: afecta a **todos** los tokens de la respuesta —texto, llamadas a tools y sus argumentos, y el thinking cuando está activo—, y funciona esté el thinking activado o no. La documentación lo llama *«a behavioral signal, not a strict token budget»*: a nivel bajo el modelo sigue pensando en los problemas difíciles, solo que menos.

Con tools el efecto es más profundo de lo que parece. A menor effort el modelo **combina operaciones en menos llamadas, hace menos llamadas y va directo a la acción sin preámbulo**. Eso es un cambio de estrategia, no de estilo.

## Por qué te importa

Un embudo de merchandising tiene dos regímenes que hoy probablemente comparten configuración. Cualificar un mensaje que entra por formulario —qué quiere, cuántas unidades, para cuándo, si merece que lo coja una persona— es una tarea acotada y de mucho volumen: la documentación sitúa ahí `low`, *«for high-volume or latency-sensitive workloads […] where faster turnaround is prioritized»*. Redactar la propuesta que se le manda a ese cliente no es eso.

Un aviso de honestidad: **la documentación no publica cifras de ahorro ni de degradación por nivel**. Dice «significant token savings with some capability reduction» para `low` y repite que hay que medirlo en tu caso. Así que aquí no hay porcentaje que copiar; hay una palanca y la obligación de medirla con tus mensajes reales, incluidos los mal escritos.

Y la trampa, que es la razón de esta pieza. El effort de nivel superior da forma al prompt renderizado, así que **cambiarlo entre peticiones no conserva los prefijos cacheados de los turnos anteriores**. La recomendación explícita es elegir un nivel al empezar la conversación y mantenerlo, y variar entre cargas de trabajo en vez de dentro de una conversación que vive de la caché.

Hay una salida para quien la necesite: en Claude Opus 5 y Fable 5.1 existe un cambio de effort por mensaje, todavía en beta, que sí conserva la caché. Pero si tu embudo son conversaciones cortas y muchas, la respuesta correcta es más simple: un effort por ruta, fijo, elegido tras medir.
