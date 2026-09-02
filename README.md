# AI Systems Daily

Newsletter diaria sobre **sistemas de IA aplicados**: cómo se construyen, se miden
y se rompen los sistemas que ponen modelos en producción.

Se publica sola. Una rutina programada de Claude Code lee las fuentes, escribe la
edición y hace push a `main`; GitHub Actions despliega a GitHub Pages.

📡 https://pauqbrs.github.io/pauqbrs-ai-systems-daily

## Cómo está montado

| Ruta | Qué es |
|---|---|
| `CLAUDE.md` | Manual de operación y **contrato editorial**. Manda sobre el prompt de la rutina. |
| `config/sources.md` | Fuentes a vigilar, por nivel de prioridad. |
| `config/projects.md` | Proyectos activos y qué material sirve a cada uno. |
| `src/content.config.ts` | Los esquemas. El build falla si una pieza no cumple. |
| `src/content/pills/` | Las piezas. `YYYY-MM-DD-slug.md` |
| `src/content/editions/` | El editorial de cada día. `YYYY-MM-DD.md` |
| `src/content/guides/` | Guías operativas, nacidas de issues `guia-solicitada`. |

Los archivos que empiezan por `_` (las plantillas) quedan fuera de las colecciones.

## Desarrollo

```bash
bun install
bun run dev      # http://localhost:4321/pauqbrs-ai-systems-daily
bun run build    # valida el contenido contra los esquemas
```

## Pendiente antes de la primera edición real

- [ ] Completar en `config/projects.md` la **fase** y las **preguntas abiertas** de
      `customlab` y `sistema-gestorias`. Sin eso el aterrizaje de cada pieza sale
      plausible pero genérico.
- [ ] Ponerle nombre al sistema para gestorías y renombrar el slug.
- [ ] Revisar el resto de `CLAUDE.md`.
- [ ] Completar `config/sources.md` con las fuentes de sector propias.
- [ ] Revisar el tono de `src/content/guides/auditoria-rapida-gestoria-v1.md`: es
      la referencia que copiarán las demás guías, y la escribió Claude.
- [ ] Activar Pages: *Settings → Pages → Source: GitHub Actions*.
- [ ] Alinear el nombre del repo con el prompt de la rutina (apunta a
      `pauqbrs/ai-systems-daily`). Si renombras, cambia `base` en `astro.config.mjs`.
