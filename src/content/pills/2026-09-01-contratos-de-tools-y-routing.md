---
title: 'El trabajo de un agente en producción no está en el framework, está en el harness'
date: 2026-09-01
section: agentes
depth: pill
readingMinutes: 2
tldr: 'Lo que separa un agente de demo de uno que aguanta no es el modelo ni la librería: son contratos de tools explícitos, fronteras de memoria claras y enrutamiento determinista para todo lo que no necesita criterio.'
source:
  url: 'https://mlflow.org/articles/building-production-ready-ai-agents-in-2026/'
  author: 'MLflow'
  platform: blog
tags: ['arquitectura', 'tools', 'fiabilidad', 'observabilidad']
projects: ['sistemas-gestorias', 'auditoria-gestorias']
glossary:
  - term: harness
    definition: 'Todo el andamiaje que rodea al modelo: el bucle de ejecución, las tools, el manejo de errores, los reintentos y los logs. Es donde vive de verdad la ingeniería de un agente.'
  - term: tool contract
    definition: 'La definición de una tool: qué recibe, qué devuelve y qué pasa si falla. Cuanto más explícito, menos tiene que adivinar el modelo.'
  - term: deterministic routing
    definition: 'Decidir con código, no con el modelo, qué camino sigue el flujo. Si la regla es "facturas de más de 3.000 € van a revisión humana", eso es un if, no un prompt.'
  - term: observability
    definition: 'Poder ver qué hizo el agente y por qué: qué tools llamó, con qué entradas, qué devolvieron y dónde se torció.'
apply:
  - 'Repasa cada tool de tu agente: ¿qué devuelve cuando falla? Si la respuesta es "una excepción" o "un string cualquiera", el modelo va a improvisar sobre basura.'
  - 'Localiza en tu flujo las decisiones que siempre tienen la misma respuesta y sácalas del prompt: conviértelas en código. Cada decisión que le quitas al modelo es una fuente de variabilidad menos.'
  - 'Instrumenta desde el primer día: guarda cada llamada a tool con su entrada, su salida y su duración. Meter observabilidad después cuesta meses.'
  - 'Valida las entradas antes de ejecutar la tool, no después. Un fallo de tool se propaga a un fallo de agente, y ahí ya es difícil de diagnosticar.'
quiz:
  - question: 'En tu agente de gestoría, las facturas de más de 3.000 € tienen que pasar siempre por revisión humana. ¿Cómo lo implementas?'
    options:
      - 'Lo escribes en el system prompt para que el modelo lo tenga en cuenta.'
      - 'Con una condición en código que enruta antes de llamar al modelo.'
      - 'Le das al modelo una tool "escalar_a_humano" y confías en que la use.'
      - 'Añades un ejemplo en el prompt con una factura de 3.500 €.'
    answer: 1
    explanation: 'Una regla que no admite criterio no debe depender de que el modelo la respete. El enrutamiento determinista la garantiza al 100%; el prompt la garantiza casi siempre, y ese "casi" es exactamente donde te la juegas con un cliente. Reserva el modelo para lo que sí requiere juicio: clasificar el gasto, detectar un duplicado, redactar la consulta.'
  - question: '¿Por qué el artículo insiste en que la ingeniería vive en el harness y no en el framework?'
    options:
      - 'Porque los frameworks de agentes son de mala calidad.'
      - 'Porque el bucle, las tools, el manejo de errores y los evals son lo que decide si el agente aguanta, y eso no te lo da ninguna librería.'
      - 'Porque construir desde cero siempre es mejor.'
      - 'Porque los frameworks no soportan tool use.'
    answer: 1
    explanation: 'El framework te ahorra el andamiaje inicial, que es la parte fácil. Lo que decide si el agente sobrevive a un cliente real —qué pasa cuando una tool devuelve un timeout, cómo se reintenta, qué se registra, cómo mides si va mejor o peor que la semana pasada— lo escribes tú, uses la librería que uses.'
---

## La frase que resume el artículo

> Construir un agente que funciona en una demo es sencillo. Construir uno que funciona de forma fiable en producción requiere trabajo de ingeniería que vive en el harness, el entorno, el almacén y la capa de evaluación — mucho más que en el framework.

Es una observación incómoda si acabas de elegir librería, porque significa que la elección importa menos de lo que parecía.

## Las tres cosas que sí importan

**Contratos de tools explícitos.** Una tool no es una función, es una interfaz que un modelo va a usar sin poder preguntarte dudas. Si devuelve algo ambiguo cuando falla, el modelo razonará sobre esa ambigüedad y tomará una decisión mala con total confianza. Un fallo de tool se convierte en un fallo de agente.

**Fronteras de memoria explícitas.** Qué recuerda el agente, durante cuánto tiempo y quién puede borrarlo. Sin esto acabas con estado compartido que se corrompe entre ejecuciones y con bugs imposibles de reproducir.

**Enrutamiento determinista.** Todo lo que tiene una respuesta fija debe resolverlo el código. El modelo es caro, es variable y es lento: gástalo solo donde hace falta criterio.

## Y una advertencia sobre la observabilidad

El artículo es tajante: los equipos que dejan la monitorización para después se pasan meses metiéndola a martillazos en sistemas que nunca se diseñaron para ser observados. Cuando un cliente te diga "esta factura la clasificó mal", vas a necesitar poder responder **por qué**. Si no guardaste la traza, tu respuesta es un encogimiento de hombros.
