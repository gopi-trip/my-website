import { getCollection, type CollectionEntry } from 'astro:content';

type Draftable = 'writings' | 'projects' | 'research' | 'wiki' | 'micro';

/** Drafts are visible in `astro dev`, hidden in production builds. */
const visible = (e: { data: { draft?: boolean } }) => import.meta.env.DEV || !e.data.draft;

export async function published<C extends Draftable>(name: C): Promise<CollectionEntry<C>[]> {
  return (await getCollection(name, visible as never)) as CollectionEntry<C>[];
}

const time = (d?: Date) => d?.valueOf() ?? 0;

export const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) => time(b.data.date) - time(a.data.date);

export async function getWritings() {
  return (await published('writings')).sort(byDateDesc);
}

export async function getProjects() {
  const order = { active: 0, paused: 1, done: 2, archived: 3 } as const;
  return (await published('projects')).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || order[a.data.status] - order[b.data.status] || byDateDesc(a, b),
  );
}

export async function getResearch() {
  return (await published('research')).sort(byDateDesc);
}

export async function getMicro() {
  return (await published('micro')).sort(byDateDesc);
}

export async function getNow() {
  return (await getCollection('now')).sort(byDateDesc);
}

export const wikiUpdated = (e: CollectionEntry<'wiki'>) => e.data.updated ?? e.data.created;

export async function getWiki() {
  return (await published('wiki')).sort((a, b) => time(wikiUpdated(b)) - time(wikiUpdated(a)));
}

/** wiki/ml/attention -> "ml"; top-level notes -> "misc" */
export const wikiCategory = (e: CollectionEntry<'wiki'>) => (e.id.includes('/') ? e.id.split('/')[0] : 'misc');

export type Backlink = { href: string; title: string; collection: string };

/**
 * Every entry anywhere on the site that links to this wiki note,
 * either with [[wikilink]] syntax or a plain /wiki/... markdown link.
 */
export async function backlinksTo(note: CollectionEntry<'wiki'>): Promise<Backlink[]> {
  const leaf = note.id.split('/').pop()!;
  const patterns = [
    new RegExp(`\\[\\[\\s*(?:${escape(note.id)}|${escape(leaf)})\\s*(\\||\\]\\])`, 'i'),
    new RegExp(`\\]\\(/wiki/${escape(note.id)}/?\\)`, 'i'),
  ];
  const hits = (body?: string) => !!body && patterns.some((p) => p.test(body));

  const [wiki, writings, projects, research] = await Promise.all([
    published('wiki'),
    published('writings'),
    published('projects'),
    published('research'),
  ]);
  const out: Backlink[] = [];
  for (const e of wiki) if (e.id !== note.id && hits(e.body)) out.push({ href: `/wiki/${e.id}/`, title: e.data.title, collection: 'wiki' });
  for (const e of writings) if (hits(e.body)) out.push({ href: `/writings/${e.id}/`, title: e.data.title, collection: 'writings' });
  for (const e of projects) if (hits(e.body)) out.push({ href: `/projects/${e.id}/`, title: e.data.title, collection: 'projects' });
  for (const e of research) if (hits(e.body)) out.push({ href: `/research/${e.id}/`, title: e.data.title, collection: 'research' });
  return out;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export type Tagged = { href: string; title: string; date: Date; collection: string };

/** All tags across the site, with what's filed under each. */
export async function getTagIndex(): Promise<Map<string, Tagged[]>> {
  const [writings, projects, research, wiki] = await Promise.all([getWritings(), getProjects(), getResearch(), getWiki()]);
  const map = new Map<string, Tagged[]>();
  const add = (tags: string[], item: Tagged) => {
    for (const raw of tags) {
      const t = raw.toLowerCase();
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(item);
    }
  };
  for (const e of writings) add(e.data.tags, { href: `/writings/${e.id}/`, title: e.data.title, date: e.data.date, collection: 'writing' });
  for (const e of projects) add(e.data.tags, { href: `/projects/${e.id}/`, title: e.data.title, date: e.data.date, collection: 'project' });
  for (const e of research) add(e.data.tags, { href: `/research/${e.id}/`, title: e.data.title, date: e.data.date, collection: 'research' });
  for (const e of wiki) add(e.data.tags, { href: `/wiki/${e.id}/`, title: e.data.title, date: wikiUpdated(e), collection: 'wiki' });
  for (const list of map.values()) list.sort((a, b) => time(b.date) - time(a.date));
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export const tagHref = (t: string) => `/tags/${encodeURIComponent(t.toLowerCase())}/`;

/** A mixed "recently tended" log for the home page. */
export async function getRecent(limit = 8) {
  const [writings, wiki, projects, research] = await Promise.all([getWritings(), getWiki(), getProjects(), getResearch()]);
  const items = [
    ...writings.map((e) => ({ href: `/writings/${e.id}/`, title: e.data.title, date: e.data.updated ?? e.data.date, verb: e.data.updated ? 'revised' : 'wrote', where: 'writings' })),
    ...wiki.map((e) => ({ href: `/wiki/${e.id}/`, title: e.data.title, date: wikiUpdated(e), verb: e.data.updated ? 'tended' : 'planted', where: 'wiki' })),
    ...projects.map((e) => ({ href: `/projects/${e.id}/`, title: e.data.title, date: e.data.date, verb: 'started', where: 'projects' })),
    ...research.map((e) => ({ href: `/research/${e.id}/`, title: e.data.title, date: e.data.date, verb: 'filed', where: 'research' })),
  ];
  return items.sort((a, b) => time(b.date) - time(a.date)).slice(0, limit);
}
