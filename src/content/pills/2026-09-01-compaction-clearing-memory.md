---
title: 'Las tres palancas para que un agente no se ahogue en su propio contexto'
date: 2026-09-01
section: datos-tokens
depth: analisis
readingMinutes: 3
tldr: 'El cookbook de Claude separa tres problemas distintos que la gente mete en el mismo saco: el diálogo que crece, los resultados de tools que se acumulan y el conocimiento que se pierde entre sesiones. Cada uno tiene su solución y las tres se combinan.'
sources:
  - title: 'Context engineering: memory, compaction, and tool clearing'
    url: 'https://platform.claude.com/cookbook/tool-use-context-engineering-context-engineering-tools'
    author: 'Claude Cookbook (Anthropic)'
    platform: docs
tags: ['context-engineering', 'memoria', 'compaction', 'anthropic', 'coste']
project: sistema-gestorias
projectTakeaway: 'Las tres palancas son piezas componibles del andamiaje: clearing y compaction se configuran igual en todos los despachos, y la memory tool con un fichero por cliente es lo que hace que el segundo despacho arranque más rápido que el primero.'
glossary:
  - term: context window
    definition: 'El máximo de tokens que el modelo puede ver de una vez. Cuando se llena, algo hay que tirar.'
  - term: context rot
    definition: 'La degradación de la calidad de las respuestas a medida que la ventana se llena, mucho antes de llegar al límite. El modelo no falla de golpe: empieza a recordar peor.'
  - term: compaction
    definition: 'Resumir la conversación con el propio modelo y sustituir el historial completo por ese resumen.'
  - term: tool result clearing
    definition: 'Borrar el contenido de resultados de tools antiguos dejando el registro de que la tool se llamó y con qué argumentos.'
  - term: memory tool
    definition: 'Una tool que deja al agente escribir y leer ficheros persistentes, para que lo aprendido sobreviva al final de la sesión.'
apply:
  - 'Antes de elegir técnica, mira qué llena tu contexto: ¿mensajes, resultados de tools, o hace falta recordar cosas de ayer? Cada síntoma tiene una palanca distinta.'
  - 'Si son resultados de tools re-consultables (leer ficheros, consultar una API), usa clearing: no cuesta inferencia, solo invalida caché.'
  - 'Si es el hilo de la conversación, usa compaction, y escribe tú las instructions diciendo qué NO se puede perder (cifras, referencias de documento, decisiones tomadas).'
  - 'Si necesitas continuidad entre días, añade la memory tool y exclúyela del clearing: borrar tu propia memoria es el fallo más tonto y más frecuente.'
quiz:
  - question: 'Tu agente lee 8 ficheros grandes y a la mitad empieza a perder detalles. El contexto está dominado por los resultados de las lecturas. ¿Qué palanca aplicas?'
    options:
      - 'Compaction, porque resume y libera espacio.'
      - 'Tool result clearing, porque los ficheros se pueden volver a leer si hacen falta.'
      - 'La memory tool, porque hay que persistir lo leído.'
      - 'Ampliar la ventana de contexto con un modelo mayor.'
    answer: 1
    explanation: 'Clearing es la respuesta cuando lo que ocupa son resultados re-consultables. Sustituye el cuerpo del resultado por un marcador y conserva el registro de la llamada, así el agente sabe que ya leyó ese fichero y puede volver a pedirlo si lo necesita. En el ejemplo del cookbook bajó el pico de contexto de 335K a 173K tokens.'
  - question: 'La compaction resume el historial. ¿Qué se pierde de forma sistemática?'
    options:
      - 'Las decisiones arquitectónicas tomadas durante la conversación.'
      - 'Los datos concretos y poco frecuentes: cifras de una tabla, citas literales.'
      - 'Las preguntas que quedaron sin resolver.'
      - 'No se pierde nada, solo se comprime.'
    answer: 1
    explanation: 'Un resumen conserva bien lo estructural (decisiones, hechos de alto nivel, hilos abiertos) y se come lo específico. En la prueba del cookbook, la compaction mantuvo 3 de 3 hechos de alto nivel y 0 de 3 datos concretos de una tabla. Por eso el parámetro instructions existe: si necesitas las cifras, tienes que exigirlas explícitamente.'
  - question: '¿Por qué el clearing lleva un parámetro clear_at_least?'
    options:
      - 'Para que no borre resultados que el agente todavía necesita.'
      - 'Porque limpiar invalida la caché del prompt, y solo compensa si liberas suficientes tokens.'
      - 'Para limitar el coste de inferencia de la limpieza.'
      - 'Para que el borrado sea reversible.'
    answer: 1
    explanation: 'Clearing no cuesta inferencia, pero modifica el historial y por tanto rompe el prefijo cacheado. Si disparas una limpieza que libera 500 tokens, has tirado la caché de todo el prefijo para ganar casi nada. clear_at_least impone un mínimo para que la operación salga rentable.'
---

## Tres síntomas que parecen el mismo problema

"Al agente se le llena el contexto" suena a un único problema con una única solución. El cookbook de Claude lo desmonta en tres, y el acierto está justo ahí: **la técnica correcta depende de qué está ocupando el espacio.**

| Síntoma | Causa real | Palanca | Lo que cuesta |
| --- | --- | --- | --- |
| El diálogo se alarga | Mensajes acumulados | Compaction | Una inferencia extra, puntual |
| Los resultados de tools ahogan todo | Salidas re-consultables apiladas | Clearing | Nada de inferencia; rompe la caché |
| Cada sesión empieza de cero | La ventana no persiste | Memory tool | Overhead de llamadas + tu backend |

## 1. Compaction: resumir y seguir

Cuando la conversación se acerca al límite, el modelo resume lo que ha pasado y ese resumen sustituye al historial. Se configura con un disparador por tokens de entrada:

```python
context_management={
    "edits": [{
        "type": "compact_20260112",
        "trigger": {"type": "input_tokens", "value": 150_000},
        "instructions": "Conserva toda cifra cuantitativa con su fuente y qué documentos se han leído.",
    }]
}
```

El campo que de verdad importa es `instructions`. El resumen por defecto conserva lo estructural y se come lo concreto. Si tu agente audita facturas, un resumen que pierde los importes es un resumen inútil: hay que decirlo explícitamente.

## 2. Clearing: borrar el cuerpo, guardar el recibo

El *clearing* recorre los mensajes y sustituye el contenido de los `tool_result` antiguos por `[cleared to save context]`, dejando intacto el `tool_use`. El agente sigue sabiendo **que** llamó a la tool y **con qué argumentos** — solo pierde la respuesta, que puede volver a pedir.

```python
{
    "type": "clear_tool_uses_20250919",
    "trigger": {"type": "input_tokens", "value": 30_000},
    "keep": {"type": "tool_uses", "value": 4},
    "clear_at_least": {"type": "input_tokens", "value": 10_000},
    "exclude_tools": ["memory"],
}
```

Ese `exclude_tools: ["memory"]` no es opcional en la práctica. Si dejas que el clearing borre los resultados de la memory tool, el agente pierde precisamente lo que había decidido guardar.

## 3. Memory tool: sobrevivir al final de la sesión

La memory tool le da al agente un directorio `/memories` donde crear, leer, editar y borrar ficheros. El backend lo implementas tú, así que el almacenamiento puede ser lo que quieras: disco, S3, una tabla de Postgres.

El sistema inyecta automáticamente un protocolo del estilo *"revisa siempre tu directorio de memoria antes de hacer nada"*, partiendo de la base de que cualquier sesión puede interrumpirse. En el ejemplo del cookbook, la segunda sesión se ahorró 4 lecturas de fichero y bajó el pico de contexto de 334K a 173K, simplemente porque la primera había dejado notas.

## Cómo se combinan

Las tres a la vez, cada una atacando su fallo:

```python
context_management={"edits": [
    {"type": "clear_tool_uses_20250919", "trigger": ..., "exclude_tools": ["memory"]},
    {"type": "compact_20260112", "trigger": ..., "instructions": "..."},
]}
# más la memory tool en la lista de tools, con tu handler
```

## Traducido a tu caso

Un agente que audita una gestoría lee decenas de documentos: eso es **clearing**. La conversación con el cliente durante la sesión se alarga: eso es **compaction** con instrucciones de conservar cifras y nombres. Y lo que aprendiste del despacho el martes tiene que estar disponible el jueves: eso es **memory**, con un fichero por cliente.

Ese último punto es el más interesante de los tres para vender: un agente que recuerda al cliente entre sesiones no es una demo, es un producto.
