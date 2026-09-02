# Prompt de la rutina diaria

Este es el texto que va en el campo **Instructions** de la rutina en
[claude.ai/code/routines](https://claude.ai/code/routines). Vive aquí para que
esté versionado: si lo cambias en la web, cámbialo también aquí.

La rutina debe configurarse con:

- **Repositorio:** `pauqbrs/ai-systems-daily` (obligatorio — sin esto la sesión
  no tiene credenciales de escritura y el trabajo se pierde).
- **Entorno:** NEWSLETTER PAU IA.
- **Trigger:** Schedule → diario. Hora local pensada para que la edición esté
  lista antes de las 8:00.

---

Genera la edición diaria de AI Systems Daily, la newsletter de Pau sobre sistemas de IA aplicados.

## Paso 1 — Cargar contexto

El repositorio `pauqbrs/ai-systems-daily` ya está clonado. Lee, en este orden y enteros:

- `CLAUDE.md` — es el manual de operación y el contrato editorial. Manda sobre estas instrucciones.
- `config/projects.md` — los proyectos de Pau. Presta atención especial a **«qué material NO le sirve»** (descarta material antes de escribirlo) y **«preguntas abiertas»** (si una fuente responde una, esa pieza sube de prioridad).
- `config/sources.md` — las fuentes a vigilar, por nivel de prioridad.
- Los archivos de `src/content/pills/` de los últimos 14 días, para no repetir temas.
- `src/content.config.ts` — el esquema. Sus mínimos de longitud son el control de calidad: si el build se queja, escribe mejor o publica menos piezas. NUNCA relajes el esquema para que algo pase.

## Paso 2 — Atender peticiones de guía (va ANTES de la edición)

Busca en `pauqbrs/ai-systems-daily` los issues abiertos con la etiqueta `guia-solicitada` **o cuyo título empiece por `Guía:`**. La detección por título es la que manda: la etiqueta puede no existir. Son peticiones explícitas de Pau y tienen prioridad sobre la edición del día. Si no puedes leer los issues, salta este paso y dilo en el resumen final.

Para cada issue, sigue la sección 6 de CLAUDE.md: lee los pills que menciona, escribe la guía en `src/content/guides/`, y cierra el issue con un comentario que enlace a la guía publicada. Usa `src/content/guides/auditoria-rapida-gestoria-v1.md` como referencia de tono y `_template.md` como esqueleto de campos.

## Paso 3 — Investigar y escribir la edición

Sigue CLAUDE.md al pie de la letra. En resumen:

- Entre 3 y 5 piezas, unos 7 minutos de lectura en total. Nunca más de 5.
- 1-2 análisis (`depth: analisis`) y 2-3 pills (`depth: pill`).
- Secciones: `gestorias` (prioritaria), `agentes`, `datos-tokens`, `prompting-claude`. No hay que cubrir las cuatro cada día.
- Español, con la jerga técnica en inglés SIN traducir pero SIEMPRE explicada en `glossary`.
- Cifras concretas verificadas o nada. Explica el mecanismo, no el titular.
- `project`: UNO solo por pieza, con su `projectTakeaway` concreto diciendo qué cambia en ese proyecto. Si dudas entre dos, el aterrizaje no está claro: piénsalo más.
- `quiz`: 2-3 preguntas de APLICACIÓN, no de memoria, con distractores plausibles, y `explanation` que diga por qué las otras opciones no valen.

REGLA DURA: no resumas ninguna fuente que no hayas abierto y leído. Si no puedes verificar algo, no lo publiques. Es preferible una edición de 3 piezas a una de 5 con relleno o con cifras inventadas.

Escribe también el editorial del día en `src/content/editions/YYYY-MM-DD.md`, con el hilo conductor en el campo `thread`.

## Paso 4 — Validar y publicar

1. `bun install && bun run build`. El build valida el contenido contra los esquemas.
2. Si el build falla, arregla el CONTENIDO, nunca el esquema. No publiques nada que no compile.
3. Publica en una rama `claude/`, **NUNCA en main**:

   ```bash
   RAMA="claude/edicion-$(date +%F)"
   git checkout -b "$RAMA"
   git add -A
   git commit -m "Edición del $(date +%F)"
   git push -u origin "$RAMA"
   ```

   El workflow `.github/workflows/deploy.yml` se dispara con esa rama, la fusiona en `main` con el token del repositorio y despliega a GitHub Pages. No abras ningún pull request.

4. Comprueba que el workflow ha pasado. Si falla, mira el log y arregla el contenido.
5. Termina con un resumen: qué piezas has publicado, de qué fuentes, y qué guías. Si algo no se pudo hacer, dilo explícitamente.
