---
title: 'Lo que cuesta una skill no es su cuerpo: es su descripción, y lo que sobrevive a la compaction'
date: 2026-09-04
section: prompting-claude
depth: analisis
readingMinutes: 3
tldr: 'La descripción de cada skill está siempre en contexto, con un tope de 1.536 caracteres. El cuerpo solo se carga al usarse, pero entonces se queda para siempre. Y tras una compaction se reinyecta recortado a 5.000 tokens, con un presupuesto conjunto de 25.000 para todas.'
sources:
  - title: 'Extend Claude with skills'
    url: 'https://code.claude.com/docs/en/skills'
    author: 'Anthropic'
    platform: docs
tags: ['skills', 'claude-code', 'contexto', 'compaction', 'subagentes', 'anthropic']
project: auditoria-gestorias
projectTakeaway: 'Da la regla para montar el guion de la auditoría como skills en vez de como un CLAUDE.md gigante, y avisa del fallo que arruinaría una sesión larga: si el guion pasa de 5.000 tokens, la compaction lo trunca y el modelo sigue entrevistando con medio guion sin decírtelo.'
glossary:
  - term: skill
    definition: 'Un directorio con un fichero SKILL.md que contiene instrucciones para una tarea concreta. Claude lo carga cuando es relevante, o lo invocas tú escribiendo una barra y su nombre.'
  - term: frontmatter
    definition: 'El bloque YAML entre marcas de tres guiones al principio de un fichero Markdown, donde van los metadatos: aquí, el nombre de la skill, su descripción y cómo debe ejecutarse.'
  - term: progressive disclosure
    definition: 'Revelación progresiva: enseñarle al modelo solo un resumen de cada capacidad y cargar el detalle únicamente cuando decide usarla. Es lo que permite tener muchas skills sin pagarlas todas.'
  - term: auto-compaction
    definition: 'El resumen automático de la conversación que hace Claude Code cuando el contexto se llena. Sustituye el historial por un resumen y reinyecta después parte de lo que había.'
  - term: fork
    definition: 'Ejecutar algo en un contexto aparte, con su propia ventana, que devuelve solo el resultado a la conversación principal.'
apply:
  - 'Cuenta los caracteres de la descripción de cada skill que tengas: la descripción y el when_to_use se truncan juntos a 1.536 caracteres en el listado. Pon el caso de uso principal en la primera frase, porque es lo único que seguro se lee.'
  - 'Mide el cuerpo de tu skill más importante en tokens. Si pasa de 5.000, decide tú qué va en esos primeros 5.000, porque es lo único que vuelve tras una compaction.'
  - 'Marca con disable-model-invocation: true toda skill que solo quieras lanzar tú. Deja de competir por la atención del modelo y deja de colarse en los subagentes.'
  - 'Pon context: fork en las skills largas cuyo resultado te interesa más que su procedimiento: el cuerpo no entra nunca en tu conversación, solo vuelve el resultado.'
quiz:
  - question: 'Tienes doce skills en el proyecto y ninguna se ha invocado todavía. ¿Qué está pagando esa sesión en contexto?'
    options:
      - 'Nada: las skills no cuestan hasta que se usan.'
      - 'Las doce descripciones (con when_to_use), truncadas a 1.536 caracteres cada una; los cuerpos, no.'
      - 'Los doce cuerpos completos, porque el modelo tiene que poder elegir.'
      - 'Solo la descripción de la última que instalaste.'
    answer: 1
    explanation: 'El listado de skills tiene que estar en contexto para que el modelo pueda decidir cuál usar, y ese listado lo forman las descripciones, no los cuerpos: la documentación fija el corte de description más when_to_use en 1.536 caracteres precisamente «to reduce context usage». Decir que no cuestan nada es el error que lleva a acumular cuarenta skills; decir que se cargan enteras es el malentendido opuesto, y anularía todo el mecanismo. Y el corte aplica a todas, no solo a la última.'
  - question: 'Tu skill del guion de auditoría ocupa 9.000 tokens. Vas por la hora y media de entrevista y salta una compaction. ¿Qué pasa con el guion?'
    options:
      - 'Se reinyecta completo: las skills invocadas están protegidas.'
      - 'Se reinyecta solo la primera mitad, los primeros 5.000 tokens.'
      - 'Desaparece y Claude vuelve a leer el fichero cuando lo necesite.'
      - 'Se resume junto con el resto de la conversación.'
    answer: 1
    explanation: 'La documentación dice que la compaction reengancha la invocación más reciente de cada skill «keeping the first 5,000 tokens of each», con un presupuesto conjunto de 25.000 tokens repartido empezando por la más reciente. Tu guion vuelve truncado por la mitad, y el modelo sigue conduciendo la entrevista sin avisarte de que le falta el final. Que se relea del fichero no ocurre: la documentación es explícita en que Claude Code no vuelve a leer el fichero en turnos posteriores. Y no se resume: se recorta, que es peor, porque un resumen al menos menciona lo que había.'
  - question: 'Quieres que Claude ejecute una skill larga de revisión sin que sus instrucciones se queden en tu conversación. ¿Qué haces?'
    options:
      - 'Acortar el cuerpo hasta que quepa sin molestar.'
      - 'Poner context: fork en el frontmatter, para que se ejecute en un subagente y solo vuelva el resultado.'
      - 'Invocarla al final del todo, para que dure menos en contexto.'
      - 'Poner disable-model-invocation: true.'
    answer: 1
    explanation: 'context: fork ejecuta la skill en un subagente con su propio contexto: el cuerpo del SKILL.md es el prompt de ese subagente y nunca entra en tu conversación, que recibe únicamente el resultado. Acortar el cuerpo ayuda al coste pero no cambia el mecanismo, y suele significar tirar instrucciones que hacían falta. Invocarla al final no sirve de nada, porque el contenido se queda desde que entra hasta el final de la sesión. Y disable-model-invocation resuelve otro problema, el de quién dispara la skill, no el de dónde se ejecuta.'
---

## El malentendido que hace caro un sistema de skills

La forma habitual de pensar en las skills es «una carpeta con instrucciones que Claude lee cuando le hacen falta», y de ahí sale la conclusión de que tener muchas es gratis. No lo es, y el sitio donde se paga no es donde uno esperaría.

La documentación de Claude Code describe tres momentos distintos, con tres economías distintas.

## Momento 1: la skill existe. Pagas la descripción

Para que el modelo pueda decidir qué skill usar, tiene que ver un listado. Ese listado son las **descripciones**, no los cuerpos. Y tiene un tope duro:

> the combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing to reduce context usage

Dos consecuencias prácticas. La primera, que el coste base de tu sistema de skills es el número de skills multiplicado por lo que ocupe cada descripción: veinte skills con descripciones de párrafo son un peaje en cada llamada de la sesión. La segunda, que la documentación te dice exactamente qué escribir primero —*«put the key use case first»*—, porque lo que pase de 1.536 caracteres se corta y el modelo nunca lo ve.

Si una skill no se dispara cuando debería, el problema casi nunca está en el cuerpo. Está en que el disparador quedó del lado equivocado del corte.

## Momento 2: la skill se usa. El cuerpo entra y ya no sale

> the rendered `SKILL.md` content enters the conversation as a single message and stays there across later turns

Esto invierte la intuición. Una skill no es una función que se llama y se olvida: es un bloque que entra una vez y se queda hasta el final de la sesión. Por eso la propia documentación avisa de que *«every line is a recurring token cost»*.

Hay un detalle bien resuelto: si la vuelves a invocar y el contenido renderizado es idéntico, Claude Code añade una nota de que ya está cargada en lugar de duplicarla. Pero si el contenido cambia —porque cambiaron los argumentos o porque una línea de contexto dinámico produjo otra salida— se añade **el cuerpo entero otra vez**.

Ahí está el fallo caro. Una skill con `!`​`comando` dentro produce contenido distinto en cada invocación por diseño. Invócala cinco veces en una sesión larga y tienes cinco copias de su cuerpo en contexto.

## Momento 3: la compaction. Aquí es donde duele

Cuando el contexto se llena y la conversación se resume, las skills no desaparecen sin más:

> Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each. Re-attached skills share a combined budget of 25,000 tokens. Claude Code fills this budget starting from the most recently invoked skill, so older skills can be dropped entirely.

Tres números que hay que tener presentes al diseñar:

| Regla | Consecuencia |
| --- | --- |
| Solo la invocación **más reciente** de cada skill | Las copias anteriores se pierden, que aquí es lo deseable |
| Primeros **5.000 tokens** de cada una | Una skill más larga vuelve truncada, y por el final |
| Presupuesto conjunto de **25.000 tokens**, llenado de la más reciente hacia atrás | Con muchas skills invocadas, las viejas se caen enteras |

Y el modo de fallo es silencioso. La documentación lo describe con precisión incómoda: si una skill parece dejar de influir, *«the content is usually still present and the model is choosing other tools»*. O sea que tienes dos causas posibles para el mismo síntoma —el contenido se recortó, o sigue ahí y el modelo lo está ignorando— y desde fuera se ven igual.

## Por qué esto decide cómo montas la auditoría

Una auditoría de despacho es exactamente el caso peligroso: sesión larga, guion que no puede degradarse a mitad de camino, y cifras que hay que recoger completas. Si el guion de entrevista vive en una skill de 9.000 tokens, la primera compaction se lleva 4.000 sin avisar, y el modelo sigue preguntando con medio guion.

De ahí salen tres reglas de diseño, no de estilo:

1. **Trocea el guion por bloques**, uno por fase de la entrevista, y que ninguno pase de 5.000 tokens. Un bloque completo vale más que medio guion largo.
2. **Pon lo que no puede perderse en los primeros tokens de cada skill.** El corte es por el principio, así que el orden dentro del fichero es una decisión de robustez.
3. **Manda a `context: fork` todo lo que sea procedimiento y no criterio.** Lo que se ejecuta en un subagente no ocupa tu ventana ni compite por el presupuesto de reinyección: vuelve el resultado y ya está. Eso sí, el subagente no ve tu historial de conversación, así que sirve para tareas cerradas, no para la entrevista en sí.

Y una advertencia que la documentación deja escrita para quien se emocione con `fork`: solo tiene sentido en skills con instrucciones ejecutables. Una skill que solo dice «sigue estas convenciones» enviada a un subagente le da al subagente unas convenciones y ninguna tarea, y vuelve sin nada.
