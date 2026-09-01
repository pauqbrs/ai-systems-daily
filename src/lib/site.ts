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
  { name: string; short: string; blurb: string }
> = {
  'auditoria-gestorias': {
    name: 'Auditoría rápida de gestorías',
    short: 'Auditoría',
    blurb:
      'Diagnosticar en una sesión corta los cuellos de botella de un despacho y devolver un plan de automatización priorizado por horas ahorradas.',
  },
  'sistemas-gestorias': {
    name: 'Sistemas de productividad para gestorías',
    short: 'Gestorías',
    blurb:
      'La línea principal: automatizaciones que se instalan y se mantienen en despachos pequeños y medianos.',
  },
  customlab: {
    name: 'CustomLab',
    short: 'CustomLab',
    blurb:
      'Personalización textil bajo demanda. Web en Vite + React + Tailwind + shadcn/ui, con precios por volumen y presupuestos automáticos.',
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
