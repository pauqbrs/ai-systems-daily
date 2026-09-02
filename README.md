# AI Systems Daily

Newsletter diaria de sistemas de IA aplicados, con archivo web y guías
interactivas de aplicación a proyectos reales.

Cada mañana antes de las 8:00 (Europe/Madrid) se publica una edición con 3-5
piezas repartidas en cuatro secciones. Cada pieza incluye un mini-examen y una
lista de pasos accionables. Marcando varias piezas se puede pedir una **guía
combinada** que las baja a un proyecto concreto.

---

## Cómo funciona

```
  7:20 Europe/Madrid
        │
        ▼
  Routine → despierta la sesión motor de publicación
        │  (una sesión persistente con el repo anclado; es lo que le
        │   da credenciales de escritura, y sin eso el trabajo se pierde)
        │
        │  lee CLAUDE.md, config/routine-prompt.md, config/projects.md
        │  atiende los issues de guía pendientes
        │  investiga las fuentes y escribe el contenido
        ▼
  src/content/{pills,editions,guides}/*.md
        │
        ▼
  git push origin main
        │
        ▼
  GitHub Actions: valida el contenido con `bun run build` y despliega
        ▼
  https://pauqbrs.github.io/ai-systems-daily
```

**Por qué `.claude/settings.json` importa:** sin él, una sesión automática se
queda bloqueada pidiendo aprobación para `git commit` y no publica nada. Ese
fichero pre-aprueba los comandos del flujo diario.

**Plan B:** el workflow también acepta ramas `claude/**` y las promociona a
`main` por su cuenta, por si algún día el push directo se rechaza.

El bucle de las guías:

```
  Lees una pieza → 🔖 la guardas en tu selección
        │
        ▼
  /seleccion → eliges proyecto + contexto → «Pedir la guía en GitHub»
        │
        ▼
  Issue con etiqueta `guia-solicitada`
        │
        ▼
  La siguiente sesión diaria escribe la guía, la publica y cierra el issue
```

## Estructura

| Ruta | Qué es |
| --- | --- |
| `CLAUDE.md` | **Manual de operación.** El contrato editorial que sigue cada sesión diaria |
| `config/sources.md` | Fuentes a vigilar, por nivel de prioridad, y calendario normativo |
| `config/projects.md` | Los proyectos activos y qué material le sirve a cada uno |
| `src/content.config.ts` | Esquemas del contenido. Es lo que hace fallar el build si una edición está mal formada |
| `src/content/pills/` | Las piezas, una por archivo |
| `src/content/editions/` | El editorial de cada día |
| `src/content/guides/` | Las guías combinadas |
| `src/components/` | Islas de React: examen, selección, bandeja |

## Desarrollo

```bash
bun install
bun run dev      # http://localhost:4321/ai-systems-daily
bun run build    # valida el contenido y genera dist/
```

En `dev` se muestran también las piezas con `draft: true`.

Para crear el esqueleto de una pieza nueva:

```bash
bun run new:pill "Título de la pieza" agentes
```

## Despliegue

GitHub Actions publica en GitHub Pages en cada push a `main`.

**Configuración inicial** (una sola vez): en *Settings → Pages*, poner **Source:
GitHub Actions**. Sin ese paso el workflow falla en el job de deploy.

Si en algún momento se usa un dominio propio, hay que quitar el base path:

```bash
SITE_BASE=/ bun run build
```

## Por qué no lee X ni LinkedIn

No hay forma de hacerlo: X no expone el home timeline y LinkedIn no tiene API
pública de lectura del feed. El contenido sale de fuentes curadas y públicas,
listadas en `config/sources.md`. Se pueden añadir personas concretas a esa lista
para seguirlas a través de su blog o su GitHub.
