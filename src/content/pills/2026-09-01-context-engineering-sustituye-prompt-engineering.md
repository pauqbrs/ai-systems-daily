---
title: 'Context engineering: el prompt ya no es el texto que escribes, es todo lo que el modelo ve'
date: 2026-09-01
section: prompting-claude
depth: pill
readingMinutes: 2
tldr: 'La disciplina ha cambiado de nombre por una razón real: el cuello de botella dejó de ser cómo redactas la instrucción y pasó a ser qué conjunto mínimo de tokens de alta señal metes en cada llamada.'
sources:
  - title: 'Context Engineering: A Practical Guide for AI Agents'
    url: 'https://sourcegraph.com/blog/context-engineering'
    author: 'Sourcegraph'
    platform: blog
tags: ['context-engineering', 'prompting', 'claude', 'coste']
project: customlab
projectTakeaway: 'En un embudo de muchas peticiones pequeñas manda el céntimo por conversación: recortar el contexto que no cambia la respuesta baja el coste unitario y la latencia a la vez, que son las dos métricas del inbound.'
glossary:
  - term: context engineering
    definition: 'Diseñar deliberadamente qué ve el modelo en cada llamada: instrucciones, tools, documentos, historial. Todo, no solo el texto que tú escribes.'
  - term: high-signal tokens
    definition: 'Tokens que aportan información que cambia la respuesta. Lo contrario de relleno: contexto "por si acaso" que diluye la atención del modelo.'
  - term: diminishing returns
    definition: 'Rendimientos decrecientes. Cada token extra aporta menos que el anterior, y a partir de cierto punto resta.'
apply:
  - 'Coge tu prompt de sistema más largo y quita un tercio. Si la calidad no baja, sobraba, y estabas pagándolo en cada llamada.'
  - 'Deja de meter documentos completos "por si acaso". Recupera el fragmento relevante y mete solo ese: el contexto no usado no es neutro, compite por la atención del modelo.'
  - 'Trata el contexto como un presupuesto con un tope, no como una mochila. La pregunta correcta no es "¿qué más le meto?" sino "¿qué es lo mínimo que necesita para acertar?".'
quiz:
  - question: 'Tu agente responde peor conforme avanza la sesión, pero la ventana de contexto está al 40%. ¿Qué está pasando?'
    options:
      - 'Es imposible: por debajo del límite el rendimiento es constante.'
      - 'Context rot: la calidad se degrada de forma medible mucho antes de llenar la ventana.'
      - 'El modelo está limitando la salida.'
      - 'Se ha invalidado la caché.'
    answer: 1
    explanation: 'La investigación de 2025 y 2026 muestra que todos los modelos frontera empeoran de forma medible a medida que crece el contexto, bastante antes de llenarlo. La ventana es un límite duro, no un umbral de calidad: llegar al 40% ya te está costando precisión. Por eso compaction y clearing se disparan por umbral de tokens y no al borde del límite.'
  - question: '¿Cuál es la formulación correcta del objetivo de context engineering?'
    options:
      - 'Aprovechar el máximo posible de la ventana de contexto.'
      - 'Encontrar el conjunto más pequeño de tokens de alta señal que maximice la probabilidad del resultado deseado.'
      - 'Reducir el número de tokens al mínimo absoluto.'
      - 'Meter todos los documentos que puedan ser relevantes.'
    answer: 1
    explanation: 'Ni maximizar ni minimizar: optimizar. El contexto es un recurso finito con rendimientos decrecientes, así que el objetivo tiene dos partes que hay que sostener a la vez —el conjunto más pequeño posible, pero de tokens que de verdad cambian la respuesta—. Recortar señal útil es tan malo como añadir ruido.'
---

## Por qué cambió el nombre

*Prompt engineering* sugería que el trabajo consistía en redactar bien una instrucción. Eso era cierto cuando la llamada al modelo era una pregunta y una respuesta.

Con un agente ya no lo es. En cada llamada el modelo ve el system prompt, las definiciones de las tools, las skills cargadas, los documentos recuperados, el historial de la conversación y los resultados de todas las tools que ha ejecutado. **El texto que tú escribes es una fracción pequeña de lo que el modelo lee.** Optimizar solo esa fracción es optimizar la pieza equivocada.

## El encuadre que lo hace accionable

La definición útil es esta: *el conjunto más pequeño de tokens de alta señal que maximiza la probabilidad del resultado que buscas.*

Tiene tres implicaciones que van contra la intuición:

- **El contexto es finito y tiene rendimientos decrecientes.** No es un depósito que llenar; es un presupuesto que asignar.
- **Todos los modelos frontera empeoran conforme crece el contexto**, y lo hacen mucho antes de llenar la ventana. La ventana es un límite físico, no un objetivo.
- **El contexto no usado no es gratis.** Un documento irrelevante no se ignora educadamente: compite por la atención del modelo y empeora la respuesta, además de costarte dinero.

## El hábito que hay que coger

Cada vez que vayas a añadir algo al contexto, la pregunta no es *"¿puede ser útil?"* — casi todo puede ser útil. Es **"¿cambia esto la respuesta?"**. Si no sabes contestar, es que no.

Y al revés: cuando un agente falla, la reacción por defecto es añadir más instrucciones. A menudo el arreglo correcto es quitar el ruido que estaba tapando las instrucciones que ya tenías.
