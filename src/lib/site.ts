const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Construye una URL respetando el `base` de GitHub Pages. */
export const href = (path: string) => `${base}/${path.replace(/^\//, '')}`;

const fmt = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (d: Date) => fmt.format(d);

/** `2026-09-02` — para atributos datetime y para ordenar. */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const SECTION_LABELS: Record<string, string> = {
  gestorias: 'Gestorías',
  agentes: 'Agentes',
  'datos-tokens': 'Datos y tokens',
  'prompting-claude': 'Prompting y Claude',
};

export const DEPTH_LABELS: Record<string, string> = {
  pill: 'Pill',
  analisis: 'Análisis',
};
