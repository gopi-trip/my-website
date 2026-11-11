import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '~/site.config';
import { getMicro, getWritings } from '~/lib/content';
import { isoDay } from '~/lib/format';

/** One feed for everything time-ordered: writings and micro posts. */
export async function GET(context: APIContext) {
  const [writings, micro] = await Promise.all([getWritings(), getMicro()]);
  const items = [
    ...writings.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/writings/${p.id}/`,
      categories: ['writing', ...p.data.tags],
    })),
    ...micro.map((m) => ({
      title: `micro · ${isoDay(m.data.date)}`,
      description: (m.body ?? '').trim(),
      pubDate: m.data.date,
      link: `/micro/${m.id}/`,
      categories: ['micro', ...m.data.tags],
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items,
    customData: `<language>${site.lang}</language>`,
  });
}
