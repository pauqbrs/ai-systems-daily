# AI Systems Daily

Newsletter diaria de Pau sobre **sistemas de IA aplicados**. No cubre "novedades de
IA" en general: cubre cómo se construyen, se miden y se rompen los sistemas que
ponen modelos en producción, y qué de eso sirve para los proyectos de la sección 3.

Este archivo es el manual de operación y el contrato editorial. **Manda sobre el
prompt de la rutina programada** en todo lo relativo a estilo, volumen y formato.

> **Estado: borrador.** Lo generó Claude al montar el repo, no Pau. Los proyectos
> de la §3 ya son los reales; lo que sigue sin confirmar son las fuentes de
> `config/sources.md` y, sobre todo, las *preguntas abiertas* de cada proyecto.

---

## 1. Qué se publica cada día

- **Entre 3 y 5 piezas.** Nunca más de 5. Tres piezas buenas > cinco con relleno.
- **~7 minutos de lectura en total**, sumando el campo `readingMinutes` de todas
  las piezas. Si la suma se va de 8, recorta.
- **1-2 análisis** (`depth: analisis`, 2-4 min cada uno) y **2-3 pills**
  (`depth: pill`, 1-2 min cada uno).
- Un **editorial** en `src/content/editions/YYYY-MM-DD.md` con el hilo conductor.
  Si las piezas del día no comparten hilo, dilo en vez de inventar uno.

### Secciones

| Sección | Qué entra |
|---|---|
| `gestorias` | **Prioritaria.** IA aplicada a despachos, asesorías y back-office documental: extracción, conciliación, cumplimiento, revisión humana. |
| `agentes` | Bucles de agente, uso de herramientas, orquestación, evaluación, modos de fallo. |
| `datos-tokens` | Coste, latencia, caching, ventanas de contexto, cuantización, throughput. |
| `prompting-claude` | Técnicas de prompting y comportamiento de modelos, con foco en Claude. |

No hay que cubrir las cuatro cada día. Sí conviene que `gestorias` aparezca la
mayoría de los días; si un día no hay nada real que contar ahí, mejor no forzarlo.

---

## 2. Reglas duras

Estas no se negocian. Ante la duda, no publicar.

1. **No resumas ninguna fuente que no hayas abierto y leído.** Ni el titular de
   otro resumen, ni el hilo de alguien contándolo. La fuente primaria o nada.
2. **Cifras concretas verificadas o nada.** Si el paper dice "mejora del 12,4 % en
   SWE-bench Verified", esa cifra va con su contexto. Si no puedes verificarla, la
   frase se cae entera — no se sustituye por "mejoras significativas".
3. **Explica el mecanismo, no el titular.** La pregunta que responde cada pieza es
   *por qué funciona así*, no *qué han anunciado*.
4. **Español**, con la jerga técnica **en inglés y sin traducir** (`prompt caching`,
   no "caché de indicaciones"), pero **siempre** explicada en el campo `glossary`.
   El esquema exige definiciones de ≥20 caracteres: una palabra no es una definición.
5. **Cada pieza baja a un proyecto** de la sección 3, de forma honesta. Si la
   relación es floja, dilo ("esto todavía no toca X, pero si Y entonces Z").
   Prohibido el aterrizaje de relleno tipo "esto es interesante para tus proyectos".
6. **Sin hype.** Nada de "revolucionario", "cambia las reglas del juego", "brutal".
   Si algo es incremental, se dice que es incremental.

---

## 3. Proyectos de Pau

El `project` de cada pieza tiene que ser uno de estos slugs. El detalle largo vive
en `config/projects.md`; esta tabla es solo el índice.

| Slug | Proyecto | Qué material le sirve |
|---|---|---|
| `customlab` | Merchandising para empresas. Automatizar el embudo entero: marketing → inbound → pedido | Voz de marca a volumen, cualificación de leads, brief libre a pedido estructurado, coste y latencia por interacción |
| `sistema-gestorias` | La base genérica para montar el pipeline a medida de cada gestoría (sin nombre aún) | Piezas componibles, configuración en vez de código, evaluación reutilizable, qué generaliza entre despachos y qué no |

> **Pendiente (Pau):** en `config/projects.md` faltan la fase de cada proyecto y
> las *preguntas abiertas*. Sin eso, el `projectTakeaway` de cada pieza sale
> plausible pero genérico, que es lo que prohíbe la §2.5.

---

## 4. Formato de una pieza

Un archivo Markdown en `src/content/pills/`, nombrado `YYYY-MM-DD-slug-corto.md`.
El frontmatter lo valida `src/content.config.ts` y **el build falla si no cumple**.

```markdown
---
title: "Título que dice el mecanismo, no el anuncio"
date: 2026-09-02
depth: analisis          # analisis | pill
section: gestorias       # gestorias | agentes | datos-tokens | prompting-claude
summary: "Una frase que resume el mecanismo. Entre 40 y 400 caracteres."
readingMinutes: 3
sources:
  - title: "Nombre real del documento"
    url: "https://..."
    publisher: "Quién lo publica"
    publishedAt: 2026-08-28
glossary:
  - term: "prompt caching"
    definition: "Reutilizar el prefijo ya procesado de un prompt entre llamadas para no volver a pagar por esos tokens."
project: sistema-gestorias
projectTakeaway: "Qué haces mañana con esto, en concreto, en ese proyecto."
quiz:
  - question: "Pregunta de aplicación, no de memoria"
    options: ["...", "...", "..."]   # 3-4 opciones
    answer: 1                         # índice 0-based
    explanation: "Por qué la correcta lo es y por qué los distractores no."
tags: ["extraccion", "evaluacion"]
---

Cuerpo en Markdown. Sin repetir el summary. Directo al mecanismo.
```

### El quiz

2-3 preguntas **de aplicación**, nunca de memoria.

- ❌ *"¿Cuánto reduce el coste el prompt caching?"* — eso es buscar un número en el texto.
- ✅ *"Tienes un pipeline que reenvía el mismo manual de 40 páginas en cada llamada
  y cambia solo la última pregunta. ¿Dónde colocas el cache breakpoint?"*

Los **distractores tienen que ser plausibles**: errores que alguien cometería de
verdad tras leer la pieza en diagonal, no opciones absurdas de relleno.

---

## 5. No repetirse

Antes de escribir, lee los archivos de `src/content/pills/` de **los últimos 14
días**. Un tema solo se repite si hay algo nuevo y verificable que añadir, y en ese
caso la pieza tiene que decir explícitamente qué cambia respecto a la anterior.

---

## 6. Guías (issues con etiqueta `guia-solicitada`)

Las guías son peticiones explícitas de Pau y **van antes que la edición del día**.

1. Busca issues abiertos con la etiqueta `guia-solicitada`.
2. Lee los pills que menciona el issue.
3. Escribe la guía en `src/content/guides/`, nombrada `tema-vN.md` (`v1`, `v2`… si
   se reescribe). Tono y estructura de referencia:
   `src/content/guides/auditoria-rapida-gestoria-v1.md`.
4. Cierra el issue con un comentario que enlace a la guía publicada.

Una guía es **operativa**: pasos que alguien ejecuta, no un ensayo. Si un paso no
se puede ejecutar sin decidir algo, la guía dice cómo decidirlo.

> La referencia de tono existe, pero la escribió Claude, no Pau. Si el registro no
> es el tuyo, corrígela: es el patrón que van a copiar todas las guías siguientes.

---

## 7. Operación

```bash
bun install && bun run build    # el build valida el contenido contra el esquema
bun run dev                     # previsualizar en local
```

- **No se publica nada que no compile.** Si el build falla, se arregla el
  contenido; no se relaja el esquema para que pase.
- Commit y push a `main`. GitHub Actions despliega a GitHub Pages solo.
- Si el push falla por credenciales, no darlo por hecho: hay que decirlo e incluir
  el diff completo para poder recuperarlo.

### Nombre del repo

El repo es **`pauqbrs/pauqbrs-ai-systems-daily`** y se queda así. El `base` de
`astro.config.mjs` ya coincide. Si el prompt de la rutina todavía dice
`pauqbrs/ai-systems-daily`, el que está mal es el prompt: la rutina fallará al
clonar hasta que se corrija ahí.

Y el push necesita que el repo esté en las **fuentes autorizadas del entorno**.
Sin eso la rutina puede clonar (es público) pero no publicar, y el proxy responde
`403: not in this session's authorized repository set`.
