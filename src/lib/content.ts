import { getCollection, type CollectionEntry } from 'astro:content';
import { isoDay } from './site';

const isPublished = (draft: boolean) => import.meta.env.DEV || !draft;

/** Todos los pills publicados, del más reciente al más antiguo. */
export async function allPills(): Promise<CollectionEntry<'pills'>[]> {
  const pills = await getCollection('pills', ({ data }) => isPublished(data.draft));
  return pills.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function allEditions(): Promise<CollectionEntry<'editions'>[]> {
  const editions = await getCollection('editions', ({ data }) => isPublished(data.draft));
  return editions.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function allGuides(): Promise<CollectionEntry<'guides'>[]> {
  const guides = await getCollection('guides');
  return guides.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Agrupa pills por día (YYYY-MM-DD), preservando el orden descendente. */
export function groupByDay(pills: CollectionEntry<'pills'>[]) {
  const map = new Map<string, CollectionEntry<'pills'>[]>();
  for (const pill of pills) {
    const day = isoDay(pill.data.date);
    const bucket = map.get(day);
    if (bucket) bucket.push(pill);
    else map.set(day, [pill]);
  }
  return map;
}

/** Términos del glosario acumulados en todo el sitio, deduplicados. */
export async function glossaryIndex() {
  const pills = await allPills();
  const terms = new Map<
    string,
    { term: string; definition: string; pills: { id: string; title: string }[] }
  >();

  for (const pill of pills) {
    for (const entry of pill.data.glossary) {
      const key = entry.term.trim().toLowerCase();
      const existing = terms.get(key);
      if (existing) {
        existing.pills.push({ id: pill.id, title: pill.data.title });
      } else {
        terms.set(key, {
          term: entry.term.trim(),
          definition: entry.definition,
          pills: [{ id: pill.id, title: pill.data.title }],
        });
      }
    }
  }

  return [...terms.values()].sort((a, b) => a.term.localeCompare(b.term, 'es'));
}
