import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allPills } from '../lib/content';
import { SITE, SECTION_META } from '../lib/site';

export async function GET(context: APIContext) {
  const pills = await allPills();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? 'https://pauqbrs.github.io',
    trailingSlash: false,
    items: pills.map((pill) => ({
      title: pill.data.title,
      description: pill.data.tldr,
      pubDate: pill.data.date,
      link: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/pill/${pill.id}`,
      categories: [SECTION_META[pill.data.section].name, ...pill.data.tags],
    })),
  });
}
