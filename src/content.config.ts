import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Este archivo es el CONTRATO del proyecto.
 *
 * La sesión diaria genera Markdown que debe validar contra estos esquemas. Los
 * mínimos de longitud y de cardinalidad NO son burocracia: son el control de
 * calidad editorial. Una explicación de quiz de diez caracteres o una pieza sin
 * aterrizaje en un proyecto hacen fallar el build, y por tanto no se publican.
 *
 * Si un día el contenido no da para cumplirlos, la respuesta correcta es
 * publicar menos piezas, no relajar el esquema.
 */

export const SECTIONS = [
  'gestorias',
  'agentes',
  'datos-tokens',
  'prompting-claude',
] as const;

export const SECTION_META: Record<
  (typeof SECTIONS)[number],
  { name: string; blurb: string; accent: string }
> = {
  gestorias: {
    name: 'Sistemas para gestorías',
    blurb:
      'Automatizaciones reales en despachos y asesorías: extracción documental, conciliación, modelos AEAT, atención al cliente.',
    accent: 'sec-gestorias',
  },
  agentes: {
    name: 'Construcción de agentes',
    blurb:
      'Arquitectura, orquestación, tool use, memoria y evals. Cómo se construyen agentes que aguantan en producción.',
    accent: 'sec-agentes',
  },
  'datos-tokens': {
    name: 'Datos y ahorro de tokens',
    blurb:
      'Bases de datos para agentes, RAG, prompt caching y context engineering. Lo que abarata y acelera tus sistemas.',
    accent: 'sec-datos',
  },
  'prompting-claude': {
    name: 'Prompting con Claude',
    blurb:
      'Técnicas de prompting, skills, subagentes, CLAUDE.md, hooks y MCP. Desde las fuentes oficiales y de quien va por delante.',
    accent: 'sec-prompting',
  },
};

export const PROJECTS = [
  'auditoria-gestorias',
  'sistema-gestorias',
  'customlab',
] as const;

const glossaryEntry = z.object({
  term: z.string().min(1),
  definition: z
    .string()
    .min(20, 'Una definición de una palabra no explica nada. Escribe una frase completa.'),
});

const source = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  author: z.string().min(1),
  platform: z.enum([
    'blog',
    'docs',
    'github',
    'hackernews',
    'reddit',
    'x',
    'paper',
    'newsletter',
    'video',
    'otro',
  ]),
  publishedAt: z.coerce.date().optional(),
});

const quizQuestion = z
  .object({
    /** Pregunta de APLICACIÓN, no de memoria. Por eso el mínimo es largo. */
    question: z.string().min(15),
    options: z.array(z.string().min(1)).min(3).max(4),
    /** Índice (base 0) de la opción correcta dentro de `options`. */
    answer: z.number().int().min(0),
    /** Por qué esa es la correcta y por qué las otras no. */
    explanation: z
      .string()
      .min(40, 'La explicación tiene que decir por qué las otras opciones no valen'),
  })
  .refine((q) => q.answer < q.options.length, {
    message: '`answer` apunta fuera de `options`',
    path: ['answer'],
  });

const pills = defineCollection({
  // [^_]*.md deja fuera los _template.md sin tener que marcarlos como draft.
  loader: glob({ base: './src/content/pills', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    section: z.enum(SECTIONS),
    /** Una o dos frases: qué es y por qué te importa. Se lee en la portada. */
    tldr: z.string().min(40).max(400),
    /** 'pill' = accionable corto. 'analisis' = sistema de alguien desmontado. */
    depth: z.enum(['pill', 'analisis']),
    /** El tope de 6 existe para que ninguna pieza suelta se coma la edición. */
    readingMinutes: z.number().int().min(1).max(6),
    /** Una pieza sin fuente no se publica. Puede tener varias. */
    sources: z.array(source).min(1, 'Una pieza sin fuente no se publica'),
    /** UN proyecto, no tres. Etiquetarlos todos destruye la utilidad del campo. */
    project: z.enum(PROJECTS),
    /** Qué cambia esto en ese proyecto, concreto. Es la regla de aterrizaje,
     *  hecha obligatoria: si no sabes escribirla, la pieza no vale. */
    projectTakeaway: z.string().min(40),
    /** Jerga en inglés que aparece en el texto, explicada. */
    glossary: z.array(glossaryEntry).default([]),
    /** Pasos concretos que puedes ejecutar hoy. */
    apply: z.array(z.string().min(10)).min(1),
    /** Mini-examen. Obligatorio: sin examen no hay pieza. */
    quiz: z.array(quizQuestion).min(2).max(3),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const editions = defineCollection({
  loader: glob({ base: './src/content/editions', pattern: '**/[^_]*.md' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().min(1),
    /** El hilo que conecta las piezas de hoy. No es un índice. */
    thread: z.string().min(40),
    draft: z.boolean().default(false),
  }),
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    /** Los pills que pediste combinar. */
    basedOn: z.array(reference('pills')).default([]),
    /** El proyecto al que se aplica esta guía. */
    project: z.enum(PROJECTS),
    /** Issue de GitHub que originó la guía, si la pediste desde el blog. */
    issue: z.number().int().optional(),
    summary: z.string().min(40),
  }),
});

export const collections = { pills, editions, guides };
