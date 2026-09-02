import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Este archivo ES el contrato editorial ejecutable.
 * `bun run build` falla si una pieza no cumple el esquema: esa es la red de
 * seguridad contra ediciones con relleno, sin fuentes o sin glosario.
 */

const SECCIONES = ['gestorias', 'agentes', 'datos-tokens', 'prompting-claude'] as const;

/** Toda jerga en inglés que aparezca en el cuerpo debe estar aquí explicada. */
const glossaryEntry = z.object({
  term: z.string().min(1),
  definition: z.string().min(20, 'Una definición de una palabra no explica nada'),
});

/** Sin fuente abierta y leída no se publica. */
const source = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().optional(),
  /** Fecha de publicación de la fuente, no la del pill. */
  publishedAt: z.coerce.date().optional(),
});

/** Preguntas de aplicación: 3-4 opciones, una correcta, distractores plausibles. */
const quizQuestion = z.object({
  question: z.string().min(15),
  options: z.array(z.string().min(1)).min(3).max(4),
  /** Índice 0-based dentro de `options`. */
  answer: z.number().int().min(0),
  /** Por qué la correcta lo es y por qué los distractores no. */
  explanation: z.string().min(40),
}).refine((q) => q.answer < q.options.length, {
  message: '`answer` apunta fuera de `options`',
  path: ['answer'],
});

const pills = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/pills' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    depth: z.enum(['pill', 'analisis']),
    section: z.enum(SECCIONES),
    /** Una frase: el mecanismo, no el titular. */
    summary: z.string().min(40).max(400),
    readingMinutes: z.number().min(1).max(6),
    sources: z.array(source).min(1, 'Una pieza sin fuente no se publica'),
    glossary: z.array(glossaryEntry).default([]),
    /** Slug del proyecto de config/projects.md al que baja la pieza. */
    project: z.string().min(1),
    /** Cómo aterriza en ese proyecto, en concreto y sin promesas vacías. */
    projectTakeaway: z.string().min(40),
    quiz: z.array(quizQuestion).min(2).max(3),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const editions = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/editions' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().min(1),
    /** El hilo conductor del día, en una o dos frases. */
    thread: z.string().min(40),
    /** IDs de los pills de la edición (nombre de archivo sin .md). */
    pieces: z.array(z.string().min(1)).min(3).max(5),
    totalReadingMinutes: z.number().min(3).max(10),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    summary: z.string().min(40),
    /** IDs de los pills en los que se apoya la guía. */
    basedOn: z.array(z.string().min(1)).default([]),
    project: z.string().min(1),
    /** Número del issue de GitHub que la pidió, si vino de uno. */
    requestedIn: z.number().int().positive().optional(),
    readingMinutes: z.number().min(1).max(30),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { pills, editions, guides };
