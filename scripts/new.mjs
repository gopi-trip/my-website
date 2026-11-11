#!/usr/bin/env node
/**
 * Scaffold new content with the right frontmatter.
 *
 *   npm run new -- writing  "On something"        -> src/content/writings/on-something.md
 *   npm run new -- project  "tiny-autograd"
 *   npm run new -- research "Some question" [paper|experiment|interest]
 *   npm run new -- wiki     "ml/Attention"         -> src/content/wiki/ml/attention.md
 *   npm run new -- micro    "a short thought"      -> src/content/micro/2026-11-11-1405.md
 *   npm run new -- now      "one-line summary"     -> src/content/now/2026-11-11.md
 *
 * Never overwrites an existing file.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = join(root, 'src', 'content');

const [kind, text, extra] = process.argv.slice(2);
const usage = () => {
  console.error('usage: npm run new -- <writing|project|research|wiki|micro|now> "<title or text>" [kind]');
  process.exit(1);
};
if (!kind) usage();

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const slugify = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-?\/-?/g, '/');
const q = (s) => JSON.stringify(s);

let file;
let body;

switch (kind) {
  case 'writing':
  case 'writings': {
    if (!text) usage();
    file = join(content, 'writings', `${slugify(text)}.md`);
    body = `---\ntitle: ${q(text)}\ndescription: ""\ndate: ${day}\nkind: technical\ntags: []\ndraft: true\n---\n\n`;
    break;
  }
  case 'project':
  case 'projects': {
    if (!text) usage();
    file = join(content, 'projects', `${slugify(text)}.md`);
    body = `---\ntitle: ${q(text)}\ndescription: ""\ndate: ${day}\nstatus: active\nstack: []\ntags: []\nlinks: {}\n---\n\n`;
    break;
  }
  case 'research': {
    if (!text) usage();
    const k = ['paper', 'experiment', 'interest'].includes(extra) ? extra : 'experiment';
    file = join(content, 'research', `${slugify(text)}.md`);
    body = `---\ntitle: ${q(text)}\ndescription: ""\ndate: ${day}\nkind: ${k}\nstatus: ongoing\ntags: []\n---\n\n`;
    break;
  }
  case 'wiki': {
    if (!text) usage();
    const parts = text.split('/');
    const title = parts.pop();
    const dir = parts.map(slugify).join('/');
    file = join(content, 'wiki', dir, `${slugify(title)}.md`);
    body = `---\ntitle: ${q(title)}\ndescription: ""\ncreated: ${day}\nstage: seedling\ntags: []\n---\n\n`;
    break;
  }
  case 'micro': {
    const stamp = `${day}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    file = join(content, 'micro', `${stamp}.md`);
    body = `---\ndate: ${now.toISOString()}\ntags: []\n---\n\n${text ?? ''}\n`;
    break;
  }
  case 'now': {
    file = join(content, 'now', `${day}.md`);
    body = `---\ndate: ${day}\nsummary: ${q(text ?? '')}\n---\n\n## working on\n\n- \n\n## learning\n\n- \n\n## reading\n\n- \n`;
    break;
  }
  default:
    usage();
}

if (existsSync(file)) {
  console.error(`already exists: ${relative(root, file)}`);
  process.exit(1);
}
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, body);
console.log(`created ${relative(root, file)}`);
