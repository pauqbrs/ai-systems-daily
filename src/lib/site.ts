import { SECTION_META, SECTIONS, PROJECTS } from '../content.config';

export const SITE = {
  title: 'AI Systems Daily',
  tagline: 'Sistemas de IA que puedes aplicar mañana',
  description:
    'Newsletter diaria de sistemas de IA aplicados: pills accionables, análisis de sistemas reales y guías interactivas para gestorías y proyectos propios.',
  author: 'Pau',
  repo: 'pauqbrs/ai-systems-daily',
  timezone: 'Europe/Madrid',
} as const;

export { SECTION_META, SECTIONS, PROJECTS };

export const PROJECT_META: Record<
  (typeof PROJECTS)[number],
  { name: string; short: string; blurb: string; metric: string }
> = {
  'auditoria-gestorias': {
    name: 'Auditoría rápida de gestorías',
    short: 'Auditoría',
    blurb:
      'Diagnosticar en una sesión corta los cuellos de botella de un despacho y devolver un plan de automatización priorizado por horas recuperables.',
    metric: 'Que la auditoría de un despacho nuevo salga sola y sea comparable con las anteriores.',
  },
  'sistema-gestorias': {
    name: 'Sistema base para gestorías',
    short: 'Base gestorías',
    blurb:
      'El andamiaje genérico desde el que se monta el pipeline a medida de cada despacho. Solo generaliza lo que se repite despacho tras despacho.',
    metric: 'Cuánto se tarda en poner en pie una gestoría nueva. No lo bonito que sea el sistema.',
  },
  customlab: {
    name: 'CustomLab',
    short: 'CustomLab',
    blurb:
      'Merchandising para empresas. El objetivo es automatizar el embudo entero —marketing, inbound y pedidos— como una sola cadena sin retranscripción manual entre saltos.',
    metric: 'Céntimo por conversación y minutos de respuesta, no capacidad de razonamiento.',
  },
};

/** Prefija el base path de GitHub Pages. Úsalo en TODO href interno. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

const dateFmt = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const shortFmt = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
});

export const formatDate = (d: Date) => dateFmt.format(d);
export const formatShort = (d: Date) => shortFmt.format(d);

/** YYYY-MM-DD estable, sin sorpresas de zona horaria. */
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export const sectionAccent = (section: (typeof SECTIONS)[number]) =>
  `var(--color-${SECTION_META[section].accent})`;

/** Clave de localStorage de la cesta de selección. Compartida entre islas. */
export const SELECTION_KEY = 'asd:selection:v1';
/** Evento que emiten las islas al cambiar la selección. */
export const SELECTION_EVENT = 'asd:selection-changed';
