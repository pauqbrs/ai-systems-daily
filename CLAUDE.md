# AI Systems Daily — manual de operación

Newsletter diaria para **Pau**, que construye sistemas de productividad con IA para
gestorías y asesorías pequeñas y medianas en España.

Este archivo es el contrato editorial. Léelo entero antes de generar una edición.

---

## 1. Qué se publica cada día

Entre **3 y 5 piezas**, unos **7 minutos de lectura en total**. Nunca más de 5.

La proporción que funciona: **1-2 análisis** (`depth: analisis`, 3 min, un sistema
real desmontado) y **2-3 pills** (`depth: pill`, 2 min, algo accionable hoy).

Es mejor publicar 3 piezas buenas que 5 con relleno. Si un día no hay material
que supere el listón, publica menos y dilo en el editorial.

### Las cuatro secciones

| id | Nombre | Qué entra |
| --- | --- | --- |
| `gestorias` | Sistemas para gestorías | Casos reales de despachos automatizando; normativa que condiciona (Verifactu, factura electrónica, AEAT, RGPD aplicado a IA) |
| `agentes` | Construcción de agentes | Arquitectura, orquestación, tool use, memoria, multi-agente, evals, fiabilidad |
| `datos-tokens` | Datos y ahorro de tokens | Bases de datos para agentes, RAG, prompt caching, context engineering, compresión |
| `prompting-claude` | Prompting con Claude | Técnicas de prompting, skills, subagentes, CLAUDE.md, hooks, MCP |

**No hay que cubrir las cuatro cada día.** `gestorias` es la sección prioritaria:
si hay material bueno, va. Las demás entran cuando hay algo que merezca la pena.

---

## 2. Cómo se escribe

**Idioma: español. Jerga técnica en inglés, sin traducir, pero explicada.**

Se escribe `prompt caching`, no «almacenamiento en caché de indicaciones». Y cada
término en inglés que aparezca por primera vez va en el campo `glossary` del
frontmatter con una definición de una frase que no dé nada por supuesto.

Reglas de estilo, en orden de importancia:

1. **Cifras concretas o nada.** «Reduce mucho el coste» no vale. «−77% en Claude
   Haiku sobre trayectorias reales» sí. Si la fuente no da números, dilo.
2. **Explica el mecanismo, no el titular.** El lector tiene que terminar sabiendo
   *cómo funciona* el sistema descrito, con la suficiente precisión para replicarlo.
   Un resumen que no permite reconstruir el sistema ha fallado.
3. **Baja siempre a su terreno.** Toda pieza termina conectando con uno de sus
   proyectos. Si no consigues hacer esa conexión de forma honesta, la pieza no vale.
4. **Sin paja.** Nada de «en el vertiginoso mundo de la IA». Empieza por el problema.
5. **Contradice cuando toque.** Si una fuente exagera o el consejo popular es
   malo, dilo. La newsletter vale por el criterio, no por el resumen.
6. **Tablas y bloques de código cuando aclaren.** Markdown estándar.

---

## 3. Fuentes

La lista viva está en `config/sources.md`. Prioridad:

1. **Fuentes primarias de Anthropic** — docs de la plataforma, engineering blog,
   cookbook, changelog de Claude Code. Máxima señal para su caso.
2. **Comunidad y open source** — Hacker News, r/LocalLLaMA, GitHub trending de
   repos de agentes. Aquí aparecen los sistemas reales antes que en los blogs.
3. **Blogs de ingeniería** de empresas que publican números reales.
4. **Normativa española** para la sección `gestorias`.

**No hay acceso al feed de X ni de LinkedIn de Pau**: no existe API para eso. Se
trabaja con contenido público indexado. Cuando cites a alguien de X, enlaza a su
blog o a su repo, no a un tuit que quizá no puedas verificar.

### Regla de verificación

**Nunca resumas algo que no has leído.** Si no has podido abrir la fuente, no
publiques la pieza. Un número inventado en una newsletter que se lee cada mañana
es peor que una edición corta.

### No repetirse

Antes de escribir, revisa los pills de los últimos 14 días
(`src/content/pills/`). Un tema repetido solo vale si aporta algo nuevo, y
entonces hay que decir explícitamente qué añade respecto a la pieza anterior.

### El filtro que más ahorra: qué NO le sirve

`config/projects.md` tiene, para cada proyecto, un apartado **«qué material NO le
sirve»**. Úsalo antes de escribir, no después: descarta el material que caiga ahí
aunque sea interesante en abstracto. Un análisis excelente de agentes autónomos de
veinte pasos no vale nada para un embudo que se juega el céntimo por conversación.

### Las preguntas abiertas

Cada proyecto tiene **preguntas abiertas**: dudas concretas que Pau tiene sin
resolver. Cuando una fuente responde una de ellas, esa pieza sube automáticamente
de prioridad y el `projectTakeaway` se escribe solo. Revísalas cada día.

---

## 4. Formato de los archivos

### `src/content/pills/YYYY-MM-DD-slug.md`

El esquema completo y autoritativo está en `src/content.config.ts`. **Los mínimos
de longitud de ese archivo son el control de calidad, no burocracia**: si el build
se queja de que una explicación es corta, la explicación es corta. La respuesta
correcta nunca es relajar el esquema, es escribir mejor o publicar menos piezas.

Notas sobre los campos que más se hacen mal:

- `tldr` — una o dos frases. Es lo que se lee en la portada y decide si abre.
- `sources` — una lista. Una pieza sin fuente no se publica. Cada fuente lleva su
  `title` real, no una descripción inventada.
- `project` — **uno solo**. El que de verdad cambia con esto. Si dudas entre dos,
  es que el aterrizaje no está claro y hay que pensarlo más.
- `projectTakeaway` — qué cambia esta pieza en ese proyecto, concreto. Es la regla
  de aterrizaje hecha obligatoria. «Es útil para el proyecto» no vale; «da el
  umbral que ordena la propuesta: horas facturables, no dificultad técnica» sí.
- `apply` — 3-4 pasos que Pau puede ejecutar hoy. Imperativos y concretos.
  «Revisa tu prompt» no vale; «abre tu agente y separa el prompt en el bloque
  estático y el variable» sí.
- `glossary` — todo término en inglés que uses. Alimenta `/glosario`.
- `quiz` — 2-3 preguntas, obligatorio. **Reglas de calidad, importantes:**
  - Preguntan por **aplicación**, no por memoria. Mal: «¿cuánto ahorra la caché?».
    Bien: «tu prompt empieza con la fecha, ¿qué pasa con la caché?».
  - Los distractores tienen que ser plausibles: errores que alguien cometería de
    verdad. Opciones absurdas hacen el examen inútil.
  - `explanation` explica por qué la correcta lo es **y por qué las otras no**.

Los archivos que empiezan por `_` (como `_template.md`) quedan fuera del build.

### `src/content/editions/YYYY-MM-DD.md`

Un editorial corto (3-5 párrafos) que da el hilo conductor del día en `thread`. No
es un índice: las piezas ya se listan solas. Es el criterio de por qué hoy va esto.

### `src/content/guides/slug.md`

Ver sección 6.

---

## 5. Rutina diaria

Cada mañana, en este orden:

0. **Comprobar si la edición de hoy ya existe.** Si
   `src/content/editions/YYYY-MM-DD.md` está, no se genera otra: la rutina puede
   dispararse dos veces el mismo día, y sobrescribir una edición publicada pierde
   trabajo. En ese caso el disparo se limita a los issues de guía y a comprobar
   que el sitio se ve.
1. `git pull` en `main`.
2. Leer `config/sources.md`, `config/projects.md` y los pills de los últimos 14 días.
3. **Atender primero los issues abiertos con la etiqueta `guia-solicitada`**
   (sección 6). Son peticiones explícitas y van antes que la edición.
4. Investigar. Abrir las fuentes de verdad.
5. Escribir entre 3 y 5 pills + el editorial del día.
6. **`bun install && bun run build`.** El build valida el contenido contra los
   esquemas. Si falla, arréglalo: no se empuja contenido que no compila.
7. Commit y `git push origin main`. El workflow valida el contenido y despliega.
8. Si algo no se pudo hacer, decirlo en el editorial. Nunca rellenar con humo.

### Sobre el push

El camino normal es empujar a `main`: está verificado que funciona y que
dispara el despliegue.

Existe un plan B por si algún día el push a `main` se rechaza. Empujar a una
rama `claude/` siempre se acepta, y el workflow la promociona a `main` con el
token del repositorio:

```bash
RAMA="claude/edicion-$(date +%F)"
git checkout -b "$RAMA" && git push -u origin "$RAMA"
```

Por esa vía el job `deploy` falla: el entorno `github-pages` solo acepta
despliegues desde las ramas de su lista, y `claude/**` no está en ella. La
promoción a `main` sí se aplica, así que el contenido no se pierde, pero **el
sitio se queda sin desplegar**: el push que hace `promocionar` usa el
`GITHUB_TOKEN`, y los pushes con ese token no disparan workflows.

Así que el plan B tiene un tercer paso obligatorio. El workflow acepta
`workflow_dispatch`, y lanzado sobre `main` sí despliega, porque `main` sí
está en la lista del entorno:

```
Actions → «Publicar y desplegar» → Run workflow → Branch: main
```

Desde una sesión, con las herramientas de GitHub: `run_workflow` sobre
`deploy.yml` con `ref: main`. Comprueba que ese run acaba en verde: es el que
publica de verdad.

### Permisos

`.claude/settings.json` pre-aprueba los comandos de git y de build. Sin él, una
sesión automática se queda bloqueada pidiendo aprobación y no publica nada. Si
añades un paso que use un comando nuevo, añádelo también ahí.

---

## 6. Guías de aplicación

Pau marca piezas mientras lee y pide una guía combinada desde `/seleccion`. Eso
abre un issue que contiene los pills, el proyecto destino y su contexto adicional.

**Cómo encontrarlos:** issues abiertos con la etiqueta `guia-solicitada` **o**
cuyo título empiece por `Guía:`. La detección por título es la que manda, porque
no depende de que la etiqueta exista en el repo.

Para cada issue abierto:

1. Leer los pills que menciona, completos.
2. Escribir `src/content/guides/<slug>.md` con el frontmatter del esquema
   (`basedOn` referencia los ids de los pills; `issue` es el número del issue).
3. La guía **no resume los pills otra vez**. Los da por leídos y produce:
   - **Qué tiene que producir el sistema** — el entregable, concreto.
   - **Decisiones de diseño** — una tabla de qué decide el modelo y qué el código.
     Esta es la parte que más valor aporta y la que más se olvida.
   - **Orden de construcción** — qué se hace primero y por qué ese orden.
   - **Comprueba que lo tienes** — 3 preguntas abiertas de aplicación al final.
4. Build, push, y cerrar el issue con el enlace a la guía publicada.

`src/content/guides/auditoria-rapida-gestoria-v1.md` es la referencia de tono y
estructura.

---

## 7. Reglas duras

- **No publicar sin haber leído la fuente.**
- **No inventar cifras.** Sin número verificado, no hay número.
- **No empujar si `bun run build` falla.**
- **No sobrepasar las 5 piezas.** El listón es «Pau lo lee entero con un café».
- **Un solo `project` por pieza**, con su `projectTakeaway` concreto.
- **No relajar los mínimos del esquema** para que algo pase el build.
- **No traducir la jerga técnica**, pero no dejarla nunca sin explicar.
