/**
 * Markdown plugin (Sätteri mdast): turn [[slug]] and [[slug|label]] into
 * links to /wiki/slug/ with class="wikilink".
 *
 * Sätteri has its own `wikilinks` feature, but it emits bare relative URLs
 * that look identical to ordinary relative links. Handling the syntax here
 * lets us point at /wiki/ and style the links. Inline code is never touched
 * (it isn't a `text` node).
 */
import { defineMdastPlugin } from 'satteri';
import { readdirSync } from 'node:fs';
import { join, sep } from 'node:path';

const WIKI_DIR = join(process.cwd(), 'src', 'content', 'wiki');

const WIKILINK = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

export const slugifyWiki = (s) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9/_-]/g, '');

/** All wiki note ids ("ml/attention"), re-read at most once a second so dev picks up new notes. */
let cache = { at: 0, ids: [] };
function wikiIds() {
  if (Date.now() - cache.at < 1000) return cache.ids;
  let ids = [];
  try {
    ids = readdirSync(WIKI_DIR, { recursive: true })
      .map(String)
      .filter((f) => /\.mdx?$/.test(f) && !f.split(sep).pop().startsWith('_'))
      .map((f) => f.split(sep).join('/').replace(/\.mdx?$/, '').toLowerCase());
  } catch {}
  cache = { at: Date.now(), ids };
  return ids;
}

/** "attention" -> "ml/attention" if that's the only match; exact ids win. */
export function resolveWikiId(target) {
  const slug = slugifyWiki(target);
  const ids = wikiIds();
  if (ids.includes(slug)) return slug;
  return ids.find((id) => id.split('/').pop() === slug) ?? null;
}

export const wikiLinks = defineMdastPlugin({
  name: 'wikilinks',
  text(node, ctx) {
    if (!node.value.includes('[[')) return;
    const parent = ctx.parent(node);
    if (parent?.type === 'link') return;
    const parts = split(node.value);
    if (parts.length > 1 || parts[0]?.type === 'link') ctx.replaceNode(node, parts);
  },
});

function split(value) {
  const out = [];
  let last = 0;
  for (const m of value.matchAll(WIKILINK)) {
    const [raw, target, label] = m;
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    const id = resolveWikiId(target);
    out.push({
      type: 'link',
      url: `/wiki/${id ?? slugifyWiki(target)}/`,
      title: id ? null : 'not written yet',
      data: { hProperties: { className: id ? ['wikilink'] : ['wikilink', 'wikilink-missing'] } },
      children: [{ type: 'text', value: (label ?? target).trim() }],
    });
    last = m.index + raw.length;
  }
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}
