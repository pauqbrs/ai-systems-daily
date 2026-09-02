---
title: 'Cómo LangChain bajó el coste de sus agentes entre un 49% y un 80% solo con caché'
date: 2026-09-01
section: datos-tokens
depth: analisis
readingMinutes: 3
tldr: 'Un agente reprocesa todo su contexto en cada paso. El equipo de Deep Agents colocó los cache breakpoints donde el prompt deja de cambiar y midió reducciones de coste de entre el 49% y el 80% sin tocar la lógica del agente.'
sources:
  - title: 'Prompt Caching in Deep Agents'
    url: 'https://www.langchain.com/blog/deep-agents-prompt-caching'
    author: 'Equipo de Deep Agents (LangChain)'
    platform: blog
tags: ['prompt-caching', 'coste', 'agentes', 'anthropic']
project: auditoria-gestorias
projectTakeaway: 'Una auditoría recorre decenas de documentos con el mismo marco y checklist en el prompt: con el breakpoint bien puesto ese bloque se paga una vez en vez de cuarenta, y eso decide si auditar sale a céntimos o a euros por cliente.'
glossary:
  - term: prompt caching
    definition: 'Guardar en el servidor del proveedor la parte del prompt que no cambia entre llamadas, para no pagarla entera cada vez. En Anthropic, escribir en caché cuesta un 25% más que un token normal y leer de ella cuesta un 90% menos.'
  - term: cache breakpoint
    definition: 'Una marca que pones en el prompt para decir "hasta aquí guárdalo en caché". Anthropic permite hasta 4 marcas por petición.'
  - term: static prefix
    definition: 'El trozo del prompt que es idéntico en todas las llamadas: system prompt, definiciones de tools, instrucciones. Es lo que interesa cachear.'
  - term: cache bust
    definition: 'Invalidar la caché sin querer. Como la caché es por prefijo, cambiar un byte en medio tira todo lo que venía después.'
apply:
  - 'Abre tu agente y separa el prompt en dos bloques: lo que es idéntico en todas las llamadas (system prompt, tools, instrucciones) y lo que cambia (mensajes, resultados de tools).'
  - 'Pon el cache breakpoint al final del bloque estático, no dentro del que cambia. Ese es el error que anula el ahorro.'
  - 'Saca del prefijo estático cualquier cosa dinámica que hayas metido ahí sin pensar: la fecha de hoy, el nombre del cliente, un contador. Cada una de esas invalida todo lo que va detrás.'
  - 'Mide antes y después con los campos de uso de tokens de la respuesta. Si no ves lecturas de caché, el breakpoint está mal puesto.'
quiz:
  - question: 'Tu prompt de agente empieza con "Hoy es {fecha_y_hora}" seguido del system prompt y las definiciones de tools. ¿Qué pasa con la caché?'
    options:
      - 'Nada: la caché ignora las variables y cachea el resto.'
      - 'Se invalida todo lo que va después de la fecha en cada llamada, porque la caché es estrictamente por prefijo.'
      - 'Solo se invalida el bloque de la fecha; el system prompt sigue cacheado.'
      - 'Se cachea igual pero con un 25% de recargo permanente.'
    answer: 1
    explanation: 'La caché de Anthropic es prefix-based: coincide desde el principio del prompt hasta el breakpoint. Un timestamp al principio cambia en cada llamada, así que ninguna petición encuentra prefijo común y pagas todo a precio completo. La solución es mover lo dinámico al final, después del contenido estable.'
  - question: '¿Dónde hay que colocar el cache breakpoint?'
    options:
      - 'Al principio del prompt, para cachear cuanto antes.'
      - 'En el último bloque que sigue siendo idéntico entre peticiones.'
      - 'En el primer bloque que cambia, para marcar la frontera.'
      - 'Al final del prompt completo, para cachearlo entero.'
    answer: 1
    explanation: 'El breakpoint marca "cachea hasta aquí". Si lo pones dentro de la zona que varía, cada petición escribe una caché nueva que nunca se reutiliza: pagas el recargo del 25% sin cobrar nunca el descuento del 90%.'
  - question: 'Escribir en caché cuesta un 25% más y leer un 90% menos. ¿Cuándo NO compensa cachear un bloque?'
    options:
      - 'Cuando el bloque es muy largo.'
      - 'Cuando el bloque se va a leer una sola vez antes de expirar.'
      - 'Cuando el agente hace muchos pasos seguidos.'
      - 'Nunca: cachear siempre compensa.'
    answer: 1
    explanation: 'Con un solo uso pagas +25% y ahorras 90% una vez: sale ligeramente a favor, pero el margen es mínimo y desaparece si la caché expira antes de que la leas. El ahorro real aparece con reutilización repetida, que es justo lo que hace un bucle de agente: decenas de llamadas contra el mismo prefijo.'
---

## El problema: un agente paga su contexto entero en cada paso

Un agente no hace una llamada al modelo, hace veinte. Y en cada una manda otra vez el system prompt, las definiciones de sus tools, las skills que tenga cargadas y todo el historial de mensajes. Es el mismo texto una y otra vez, y se paga entero cada vez.

Aquí está el detalle que mucha gente pasa por alto: **el coste de un agente no crece de forma lineal con el número de pasos, crece de forma cuadrática**. Cada paso añade tokens al historial, y ese historial se vuelve a enviar en el paso siguiente. Diez pasos no cuestan diez veces un paso; cuestan bastante más.

## La solución: decirle al proveedor qué parte no va a cambiar

El *prompt caching* ataca exactamente eso. Le marcas al proveedor dónde termina el trozo de prompt que va a ser idéntico en la siguiente llamada, y a partir de ahí ese trozo se sirve desde caché en vez de reprocesarse.

En Anthropic el mecanismo es explícito: pones hasta cuatro *cache breakpoints*. Escribir en caché cuesta un 25% más que un token de entrada normal; leer de ella cuesta un 90% menos. La aritmética es evidente en cuanto hay reutilización.

La trampa está en dónde pones la marca. **La caché funciona por prefijo**: coincide desde el primer byte del prompt hasta el breakpoint. Si algo cambia en medio del prefijo, todo lo que viene detrás deja de valer, en silencio y sin error. Esto es lo que en el post llaman *cache bust*, y el caso más habitual es autoinfligido: meter la fecha y hora al principio del system prompt.

## Lo que hicieron en Deep Agents

Su enfoque no fue "pongo cuatro breakpoints y ya". Fue estructural, en tres decisiones:

1. **Ordenar el prompt por volatilidad.** Lo más estable primero (definiciones de tools, instrucciones del sistema), lo más volátil al final (mensajes, resultados de tools). El breakpoint va en la frontera.
2. **Aislar lo que muta.** Cuando el agente actualiza su memoria o carga una skill nueva, eso invalida caché. Colocaron esos elementos de forma que el *blast radius* —cuánto prefijo se cae al cambiar algo— fuera el mínimo posible.
3. **Degradar con elegancia.** Breakpoints explícitos donde el proveedor los soporta; caché implícita donde no. El agente no tiene que saber contra qué modelo corre.

## Los números

Sobre trayectorias reales de agente, no benchmarks sintéticos:

| Modelo | Reducción de coste en tokens |
| --- | --- |
| Claude Haiku | −77% |
| GPT-4 Mini | −80% |
| Gemini 3.5 Flash | −49% |

Y un matiz que importa: **cuanto más larga es la conversación, mayor es el ahorro**. Justo al revés de lo que te dice la intuición, porque es en las conversaciones largas donde el prefijo estático se reutiliza más veces.

## Por qué esto te toca a ti

Si acabas montando un agente que audita una gestoría, ese agente va a recorrer decenas de documentos en una sola sesión. El system prompt con el marco de auditoría, las definiciones de tools y el checklist son idénticos en las cuarenta llamadas. Sin caché pagas ese bloque cuarenta veces. Con el breakpoint bien puesto, lo pagas una vez y un 10% las otras treinta y nueve.

No es una micro-optimización: es la diferencia entre que una auditoría automatizada te cueste céntimos o euros, multiplicada por cada cliente al que se la pases.
