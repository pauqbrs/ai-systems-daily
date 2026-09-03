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
3. Publica directamente en `main`:

   ```bash
   git add -A
   git commit -m "Edición del $(date +%F)"
   git push origin main
   ```

   Está verificado que funciona: el push dispara `.github/workflows/deploy.yml`, que valida el contenido y despliega a GitHub Pages. No abras ningún pull request.

   Si algún día el push a `main` te lo rechazan, el plan B es una rama `claude/`, que el workflow promociona a `main` por su cuenta:

   ```bash
   RAMA="claude/edicion-$(date +%F)"
   git checkout -b "$RAMA" && git push -u origin "$RAMA"
   ```

   Ojo: por esa vía el job `deploy` falla por la regla de ramas del entorno `github-pages`, y además el push que hace `promocionar` usa el `GITHUB_TOKEN`, que no dispara workflows. O sea que el contenido llega a `main` pero **el sitio no se despliega**. Hay un tercer paso obligatorio: lanzar el workflow a mano sobre `main` (`workflow_dispatch` / `run_workflow` con `ref: main`), que sí despliega. No des la edición por publicada hasta que ese run esté en verde.

4. Comprueba que el workflow ha pasado. Si falla, mira el log y arregla el contenido.
5. Termina con un resumen: qué piezas has publicado, de qué fuentes, y qué guías. Si algo no se pudo hacer, dilo explícitamente.

---

## Historial de incidencias

Cuatro fallos reales del 2 de septiembre de 2026, el día del montaje. Si algo se
comporta raro, empieza mirando aquí.

**1. La rutina se ejecutó, se marcó como correcta y no publicó nada.** El
repositorio se llamaba entonces `pauqbrs-ai-systems-daily` y el prompt buscaba
`ai-systems-daily`.

**2. La rutina escribió la edición entera (62.503 tokens de salida, 4,68 $) y la
perdió en el `git push`.** Se había creado por API, que no permite adjuntar
repositorios, así que sus sesiones nacían sin credenciales de escritura.

**3. El job `deploy` murió en 2 segundos sin ejecutar un paso** al publicar
desde una rama `claude/`. No es del código: el entorno `github-pages` solo
admite despliegues desde las ramas de su lista. Por eso el camino normal es
empujar a `main`, que sí está permitido. Si algún día hiciera falta desplegar
desde una rama, hay que permitir `claude/**` en Settings → Environments →
github-pages → Deployment branches.

**4. Dos sesiones se quedaron bloqueadas en «Waiting on permission: Bash»** al
hacer `git commit`. De ahí `.claude/settings.json`: pre-aprueba las órdenes de
git y de build para que ninguna sesión se quede esperando una aprobación a las
siete de la mañana. Si añades un paso al flujo que use un comando nuevo,
añádelo también a ese fichero.

**5. `git push origin main` bloqueado por el clasificador de auto mode**, en la
edición del 3 de septiembre. No es el repositorio: el mismo push funcionó el día
anterior desde otra sesión (run 14). Es el modo de permisos con el que arranca
esta sesión, que trata el push a la rama por defecto como acción sensible y lo
deniega —no lo pregunta, lo deniega— sin que `.claude/settings.json` pueda
autorizarlo. `.claude/settings.json` sí evita el bloqueo de `git commit`
(incidencia 4), que era el problema anterior.

La consecuencia práctica: **el plan B de la rama `claude/` no es un respaldo
teórico, es el camino que de verdad se usa**, y arrastra la limitación del
entorno `github-pages`. De ahí el tercer paso del apartado anterior.

**6. El sitio llevaba desde el 2 de septiembre sin desplegarse, con todos los
runs en verde.** Descubierto al comprobar la edición del 3: la portada pública
seguía mostrando la del 1. El job `deploy` no fallaba, se **saltaba**, y un job
saltado no rompe el estado del run.

La causa está en cómo Actions propaga el «skipped». `promocionar` se salta en
los push a `main` y en `workflow_dispatch`. `build` se salvaba porque lleva
`if: always()`, pero `deploy` no tenía condición, así que heredaba la implícita
`success()`, que exige que **todos** los `needs` transitivos hayan pasado —y
`promocionar`, saltado, no pasa—. Arreglado poniéndole a `deploy` la condición
explícita `if: always() && needs.build.result == 'success'`.

Lo que hace esta incidencia peligrosa no es el bug, es que se comprobó mal: la
sesión anterior dio el despliegue por bueno leyendo la conclusión del run
(«success») en vez de la del job. **Un run en verde con el job que importa
saltado se ve exactamente igual que un despliegue correcto.** La única
comprobación que vale es abrir la web y ver la edición.

**La lección de las seis:** un estado «correcto» solo significa que la sesión
terminó sin error de infraestructura. Y que el contenido esté en `main` tampoco
significa que esté publicado, ni un run en verde significa que se desplegara.
Comprueba cuatro cosas por separado: que el push llegó, que `main` tiene la
edición, que el **job** `deploy` de un run disparado desde `main` se ejecutó (no
que el run esté verde: que el job no esté `skipped`), y que la edición se ve en
<https://pauqbrs.github.io/ai-systems-daily/>.
