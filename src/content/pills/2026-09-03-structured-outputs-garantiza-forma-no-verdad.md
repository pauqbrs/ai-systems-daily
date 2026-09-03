---
title: 'Structured outputs garantiza la forma del JSON, y por eso las validaciones de negocio siguen siendo tuyas'
date: 2026-09-03
section: agentes
depth: pill
readingMinutes: 2
tldr: 'La API restringe el muestreo con una gramática compilada, así que el JSON siempre valida contra tu esquema. Pero no admite mínimos, máximos ni longitudes: justo las reglas que impiden que un pedido salga con 0 unidades.'
sources:
  - title: 'Structured outputs'
    url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs'
    author: 'Anthropic'
    platform: docs
tags: ['structured-outputs', 'json-schema', 'extraccion', 'latencia', 'prompt-caching']
project: customlab
projectTakeaway: 'Cierra la frontera del paso «brief libre a pedido estructurado»: el modelo entrega un JSON que siempre parsea, y las reglas que de verdad protegen un pedido (cantidades positivas, plazo posterior a hoy, tallas del catálogo) se quedan en código porque el esquema no puede expresarlas.'
glossary:
  - term: structured outputs
    definition: 'La función de la API de Claude que obliga a la respuesta a cumplir un esquema JSON, restringiendo lo que el modelo puede generar en lugar de pedírselo por prompt.'
  - term: constrained sampling
    definition: 'Limitar en cada paso de generación qué tokens puede elegir el modelo, de modo que la salida solo pueda seguir caminos válidos según una gramática. Es una restricción mecánica, no una instrucción.'
  - term: JSON Schema
    definition: 'El estándar para describir la forma de un documento JSON: qué campos tiene, de qué tipo son y cuáles son obligatorios.'
  - term: strict tool use
    definition: 'La variante de la misma idea aplicada a las tools: con strict activado, los argumentos con los que el modelo llama a una tool cumplen su esquema por construcción.'
apply:
  - 'Pasa el esquema del pedido a output_config.format y borra del código el bloque try/except que reintentaba cuando el JSON venía roto: con la gramática compilada ese caso deja de existir.'
  - 'Saca del esquema las restricciones numéricas y de longitud (minimum, maximum, minLength) y escríbelas como validación en tu código: el SDK las convierte en texto de descripción, así que si te quedas ahí no las está comprobando nadie del lado del modelo.'
  - 'Congela el esquema del pedido: cambiar su estructura recompila la gramática y además invalida el prompt cache de ese hilo, así que un retoque cosmético te sale caro dos veces.'
  - 'Si tu inbound tiene picos, calienta el esquema con una llamada al arrancar el día: la gramática compilada se cachea 24 horas desde el último uso, y esa primera llamada es la que paga la latencia de compilación.'
quiz:
  - question: 'Defines el esquema del pedido con "cantidad": {"type": "integer", "minimum": 1} y activas structured outputs. Llega un brief confuso y el modelo devuelve cantidad 0. ¿Qué ha pasado?'
    options:
      - 'Un bug: minimum forma parte del esquema y debería haberlo impedido.'
      - 'Las restricciones numéricas no están soportadas: el SDK las convierte en texto de descripción y solo se validan en tu cliente.'
      - 'El modelo ha ignorado el esquema porque el brief era ambiguo.'
      - 'La gramática compilada estaba caducada.'
    answer: 1
    explanation: 'La documentación lista minimum, maximum y multipleOf entre lo no soportado, junto con minLength y maxLength. La gramática garantiza que el campo existe y que es un entero, que es una garantía de forma, no de rango. Es la confusión más cara de esta función: el modelo no ha ignorado nada ni hay bug, simplemente le pediste algo que la gramática no sabe expresar y el SDK lo degradó a una frase de descripción. La caducidad de la gramática afectaría a la latencia, nunca al contenido.'
  - question: 'Tu embudo responde a mensajes de inbound y quieres bajar la latencia. Estás usando prompt caching y se te ocurre añadir un campo opcional al esquema de salida para una prueba. ¿Qué efecto tiene?'
    options:
      - 'Ninguno: el esquema de salida y la caché del prompt son cosas independientes.'
      - 'Recompila la gramática e invalida el prompt cache de ese hilo, así que pagas dos penalizaciones a la vez.'
      - 'Solo afecta a la primera llamada tras el cambio.'
      - 'Invalida la caché pero no recompila, porque el cambio es aditivo.'
    answer: 1
    explanation: 'La documentación dice las dos cosas por separado y conviene juntarlas: cambiar la estructura del esquema invalida la gramática cacheada, y cambiar el parámetro output_config.format invalida el prompt cache de esa conversación. En un embudo que se juega el céntimo y el minuto por interacción, un retoque de esquema en caliente es la clase de cambio inocente que dispara coste y latencia a la vez. Sí es cierto que solo cambiar el name o la description de una tool no invalida la gramática, pero un campo nuevo es estructura.'
---

## El problema

El paso que convierte la prosa de un cliente en un pedido —artículo, unidades por talla, técnica de estampado, plazo— falla de dos maneras distintas que casi nadie separa: **el JSON no parsea**, o **el JSON parsea y dice una tontería**. Structured outputs elimina la primera por completo y no toca la segunda.

## Cómo funciona

Pasas el esquema en `output_config.format`:

```json
{
  "output_config": {
    "format": { "type": "json_schema", "schema": { "...": "tu esquema" } }
  }
}
```

Y la API no le *pide* al modelo que lo cumpla: compila el esquema a una gramática y restringe el muestreo, de modo que en cada paso solo puede elegir tokens que mantengan la salida dentro del esquema. De ahí la diferencia de naturaleza con un prompt del tipo «responde solo con JSON»: una instrucción se cumple casi siempre; una gramática se cumple siempre.

Ayer hablábamos de sacar del prompt las decisiones que no admiten criterio. Esto es el mismo principio aplicado al formato de la salida, y añade la frontera exacta de hasta dónde llega: la gramática solo sabe de tipos y estructura.

**Lo que soporta:** los tipos básicos, `enum`, `const`, `anyOf`, `$ref` y `$def` internos, formatos de cadena como `date`, `email` o `uuid`, y `minItems` con valores 0 o 1.

**Lo que no:** esquemas recursivos, `minimum`, `maximum`, `multipleOf`, `minLength`, `maxLength`, `additionalProperties` distinto de `false` y `$ref` externos. Si usas algo de esa lista, la API responde 400 — salvo que el SDK te lo haya transformado antes, convirtiendo la restricción en texto de descripción y validándola solo en el cliente.

## Por qué te importa

Mira las dos listas con los ojos de un pedido de merchandising. `enum` te cubre el catálogo de técnicas de estampado y las tallas: eso el modelo ya no se lo puede inventar. Pero *«cantidad ≥ 1»*, *«plazo posterior a hoy»* o *«el total por tallas cuadra con las unidades»* no caben en la gramática. Son validación de negocio, y siguen viviendo en tu código.

Eso es una buena noticia mal disfrazada de limitación: te obliga a escribir explícitamente qué decide el modelo (interpretar el brief) y qué decide el código (si el pedido es aceptable). El error asimétrico de tu embudo —descartar un lead bueno cuesta mucho más que atender uno malo— se gestiona en esa segunda mitad, y ninguna gramática te la va a resolver.

Dos detalles operativos para un inbound que quiere responder en minutos: la primera llamada con un esquema nuevo paga la compilación de la gramática, y las compiladas se cachean **24 horas desde el último uso**. Y el propio esquema mete un system prompt que sube ligeramente los tokens de entrada. Nada de eso es grave; lo grave es descubrirlo el día que cambias el esquema en producción a las nueve de la mañana.
