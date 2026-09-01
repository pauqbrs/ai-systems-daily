import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Este archivo es el CONTRATO del proyecto.
 *
 * La sesión diaria de las 7:20 UTC genera Markdown que debe validar contra
 * estos esquemas. Si `astro build` falla, es que el contenido está mal formado:
 * es una red de seguridad deliberada, no un obstáculo.
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
      'Automatizaciones reales en despachos y asesorías: OCR de facturas, conciliación, modelos AEAT, atención al cliente.',
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
  'sistemas-gestorias',
  'customlab',
] as const;

const glossaryEntry = z.object({
  term: z.string(),
  /** Qué significa, en una frase, sin dar por supuesto nada. */
  definition: z.string(),
});

const quizQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2).max(5),
  /** Índice (base 0) de la opción correcta dentro de `options`. */
  answer: z.number().int().min(0),
  /** Por qué esa es la correcta y por qué las otras no. */
  explanation: z.string(),
});

const pills = defineCollection({
  loader: glob({ base: './src/content/pills', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    section: z.enum(SECTIONS),
    /** Una o dos frases: qué es y por qué te importa. Se lee en la portada. */
    tldr: z.string(),
    /** 'pill' = accionable corto. 'analisis' = sistema de alguien desmontado. */
    depth: z.enum(['pill', 'analisis']).default('pill'),
    readingMinutes: z.number().int().min(1).max(30).default(3),
    source: z.object({
      url: z.string().url(),
      author: z.string(),
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
    }),
    tags: z.array(z.string()).default([]),
    /** A cuál de tus proyectos aplica directamente. */
    projects: z.array(z.enum(PROJECTS)).default([]),
    /** Jerga en inglés que aparece en el texto, explicada. */
    glossary: z.array(glossaryEntry).default([]),
    /** Pasos concretos que puedes ejecutar hoy. */
    apply: z.array(z.string()).default([]),
    /** Mini-examen pregenerado. 2-4 preguntas. */
    quiz: z.array(quizQuestion).default([]),
    draft: z.boolean().default(false),
  }),
});

const editions = defineCollection({
  loader: glob({ base: './src/content/editions', pattern: '**/*.md' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    /** El gancho del día: qué hilo conecta las piezas de hoy. */
    hook: z.string(),
    draft: z.boolean().default(false),
  }),
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** Los pills que pediste combinar. */
    pills: z.array(reference('pills')).default([]),
    /** El proyecto al que se aplica esta guía. */
    project: z.enum(PROJECTS),
    /** Issue de GitHub que originó la guía, si la pediste desde el blog. */
    issue: z.number().int().optional(),
    summary: z.string(),
  }),
});

export const collections = { pills, editions, guides };
