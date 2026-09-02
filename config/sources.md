# Fuentes

Lista de vigilancia por nivel de prioridad. La regla de `CLAUDE.md` §2.1 sigue
mandando: **estar en esta lista no autoriza a resumir nada sin abrirlo y leerlo**.

> **Estado: propuesta inicial.** Son fuentes reales y de primera mano, pero las
> eligió Claude, no Pau. Añade las tuyas (sobre todo las de gestorías y sector
> asesoría en España, donde esta lista está claramente coja) y borra lo que no leas.

---

## Nivel 1 — revisar todos los días

Primarias, alta señal, poco ruido.

- **Anthropic — News y Engineering** · https://www.anthropic.com/news · https://www.anthropic.com/engineering
  Anuncios de modelo, model cards, y posts de ingeniería sobre agentes y contexto.
- **Anthropic — Docs (changelog)** · https://docs.claude.com/en/release-notes/overview
  Cambios de API y de features. Aquí aparecen las cosas accionables antes que en el blog.
- **OpenAI — Research y Changelog** · https://openai.com/research · https://platform.openai.com/docs/changelog
- **Google DeepMind — Blog** · https://deepmind.google/discover/blog/
- **arXiv cs.CL (últimos)** · https://arxiv.org/list/cs.CL/recent
  Filtrar sin piedad: interesan evaluación, agentes, retrieval y coste, no SOTA marginal.

## Nivel 2 — revisar cada pocos días

Ingeniería aplicada: cómo se rompen estos sistemas en producción.

- **Simon Willison** · https://simonwillison.net/
  Notas de primera mano sobre modelos y herramientas, casi siempre con el experimento hecho.
- **Hamel Husain** · https://hamel.dev/
  Evaluación de LLMs con criterio; el antídoto contra los benchmarks de marketing.
- **Eugene Yan** · https://eugeneyan.com/writing/
- **Chip Huyen** · https://huyenchip.com/blog/
- **LangChain / LlamaIndex blogs** · https://blog.langchain.dev/ · https://www.llamaindex.ai/blog
  Útiles como señal de qué patrones se están estandarizando. Escépticos con el marketing.
- **Papers with Code / Hugging Face blog** · https://huggingface.co/blog

## Nivel 3 — contexto de sector (gestorías y regulación)

Lo que convierte una novedad técnica en algo que le importa a un despacho.

- **AEAT — Novedades** · https://sede.agenciatributaria.gob.es/
  Cambios de obligación formal, plazos y formatos. Manda sobre cualquier automatización.
- **BOE — disposiciones** · https://www.boe.es/
  Solo lo que afecte a facturación electrónica, verificación de identidad o conservación documental.
- **Comisión Europea — AI Act** · https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
  Calendario de aplicación y obligaciones por nivel de riesgo.
- **AEPD — blog y guías** · https://www.aepd.es/
  Tratamiento de datos personales en flujos automatizados.

> **TODO (Pau):** faltan las fuentes de sector que ya sigas — asociaciones de
> asesorías, proveedores de software de gestión, newsletters gremiales. Son las que
> van a diferenciar la sección `gestorias` de cualquier newsletter genérica de IA.

---

## Qué NO es fuente

- Hilos de X/LinkedIn resumiendo un paper. Ve al paper.
- Agregadores y "top 10 herramientas de IA".
- Notas de prensa de vendors sin documento técnico detrás.
- Benchmarks publicados por quien vende el modelo, sin metodología reproducible.
