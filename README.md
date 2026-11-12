# my-website

A small, pixelated personal site: writings, projects, research, a wiki with
backlinks, a bookshelf, a microblog and a /now page. Static HTML, plain-text
content, almost no JavaScript, no trackers.

Built with [Astro 7](https://astro.build), TypeScript, Tailwind CSS v4 and
Markdown/MDX.

---

## Quick start

Requires **Node 22+** (developed on Node 24, see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321, drafts are visible here
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
```

| script            | what it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | dev server with hot reload                                          |
| `npm run check`   | type-check `.astro`/`.ts` files and validate content frontmatter    |
| `npm run build`   | `check`, then a clean (`--force`) static build into `dist/`         |
| `npm run preview` | serve the built site                                                |
| `npm run new`     | scaffold a new piece of content (see below)                         |

---

## Make it yours

1. **`src/site.config.ts`**: your name, tagline, description, nav order, and
   links in the footer. Nothing else hard-codes these.
2. **`src/content/pages/home.md`** and **`about.md`**: the front-page intro and
   the about page.
3. **Replace the sample content.** Everything in `src/content/` is an example.
   The wiki notes (attention, KL divergence, git rebase) are real notes you can
   keep. The about page, the `tiny-autograd` project, the two research
   entries, the `on-keeping-notes` post, the /now snapshots and the bookshelf
   entries and ratings are placeholders written to show off the layout. Files
   with placeholder text start with an HTML comment saying so.
4. Set your real URL (see [Deployment](#deployment)).

---

## Writing content

All content lives in `src/content/` as Markdown (`.md`) or MDX (`.mdx`), apart
from the bookshelf, which is one YAML file. Frontmatter is validated by the
schemas in `src/content.config.ts`, so a typo in a field name fails the build
and tells you which file and field.

Files whose names start with `_` are ignored, which is handy for scratch notes.

### Scaffolding

```bash
npm run new -- writing  "On something"                  # writings/on-something.md (draft: true)
npm run new -- project  "tiny-autograd"
npm run new -- research "Some question" interest        # kind: paper | experiment | interest
npm run new -- wiki     "ml/Attention"                  # wiki/ml/attention.md
npm run new -- micro    "a short thought"               # micro/2026-11-11-1405.md
npm run new -- now      "one-line summary"              # now/2026-11-11.md
```

The script never overwrites an existing file.

### Collections at a glance

| section     | folder / file                 | key frontmatter                                                                   |
| ----------- | ----------------------------- | --------------------------------------------------------------------------------- |
| writings    | `writings/*.md`               | `title`, `description`, `date`, `updated?`, `kind: technical\|personal`, `tags`, `draft` |
| projects    | `projects/*.md`               | `title`, `description`, `date`, `status: active\|paused\|done\|archived`, `stack`, `links`, `featured` |
| research    | `research/*.md`               | `title`, `description`, `date`, `kind: paper\|experiment\|interest`, `status`, `venue?`, `authors`, `links` |
| wiki        | `wiki/**/*.md`                | `title`, `description?`, `created`, `updated?`, `stage: seedling\|budding\|evergreen`, `tags` |
| micro       | `micro/*.md`                  | `date` (full timestamp), `tags`; the body is the post                             |
| now         | `now/*.md`                    | `date`, `summary` (shown on the home page), `location?`                           |
| bookshelf   | `bookshelf.yaml`              | `id`, `title`, `author`, `status: reading\|read\|queued\|abandoned`, `type: book\|paper`, `rating?`, `finished?`, `note?`, `link?` |
| pages       | `pages/home.md`, `about.md`   | `title`, `description?`, `updated?`                                               |

`links` accepts any of `repo`, `demo`, `paper`, `arxiv`, `pdf`, `code`.

### Drafts

`draft: true` (writings, projects, research, wiki, micro) shows the entry in
`npm run dev` and leaves it out of production builds, the RSS feed and the
sitemap.

### Wiki links and backlinks

Inside any Markdown file you can write:

```md
See [[attention]] or [[ml/kl-divergence|the KL note]].
```

- `[[attention]]` finds the note whose file is called `attention.md` in any
  folder; use `[[ml/attention]]` if two notes share a name.
- A link to a note that doesn't exist yet is still rendered, but greyed out
  with a "not written yet" tooltip, and it lands on the 404 page.
- Every wiki page lists everything on the site that links to it, through
  `[[...]]` or a plain `/wiki/...` link.
- Folders become categories: `wiki/ml/attention.md` is listed under `ml/`.

### /now

The newest file in `now/` is the /now page. Older snapshots stay online at
`/now/<date>/` and are listed under "previously". To update it, add a new file
rather than editing the old one.

### MDX

Use `.mdx` when you want components in a post:

```mdx
import Pixel from '~/components/Pixel.astro';

Here's the resident: <Pixel name="resident" scale={4} />
```

---

## Project structure

```
src/
├── site.config.ts        name, tagline, nav, footer links
├── content.config.ts     content collections and their schemas
├── content/              ← all the writing lives here
├── components/           small reusable pieces (Pixel, EntryRow, Section, Filter…)
├── layouts/
│   ├── Base.astro        html shell: head/SEO, header, footer
│   └── Article.astro     shared long-form layout (writings, projects, research, wiki)
├── lib/
│   ├── content.ts        querying: sorting, drafts, backlinks, tags, recent activity
│   ├── format.ts         dates, reading time
│   ├── icons.ts          pixel icon grids + animated sprites
│   └── wikilinks.mjs     the [[wikilink]] Markdown plugin
├── pages/                routes (one folder per section, plus rss, robots, favicon, 404)
└── styles/global.css     design tokens, base styles, prose, light/dark palettes
scripts/new.mjs           content scaffolding
```

### Design notes

- **Palette:** cream paper (`#f3eee2`) and warm ink by day, "night shift" by
  night, one brick accent and a straw highlighter. The tokens are at the top of
  `global.css`. The theme starts on day until a visitor uses the toggle.
- **Type:** JetBrains Mono for reading, Silkscreen for pixel headings and
  labels. Both are self-hosted through Fontsource, so no requests go to Google.
- **Icons** are character grids in `src/lib/icons.ts` (`#` ink, `+` highlighter,
  `.` empty), rendered to crisp SVG by `<Pixel name="…" scale={2} />`. To add
  one, draw a new grid. Animated sprites (frames + a play sequence) live in
  the same file and render with `<Sprite name="cat" />`. The favicon
  (`/favicon.svg`) is the `cat` sprite; since most browsers freeze animated SVG
  favicons, a small script in `BaseHead.astro` flips through `/favicon/<n>.svg`.
- **Separators** are 2px dotted pixel rows (`.dither`) and dotted "leaders"
  between titles and dates.
- **JavaScript** is limited to the theme toggle, the favicon cat, the list filters (writings,
  projects, bookshelf) and the wiki search. All of it is progressive
  enhancement: without JS everything is still listed.

### Markdown processor

Astro 7 uses **Sätteri** as its default Markdown processor, so remark and
rehype plugins don't apply. The wikilink plugin is a Sätteri mdast plugin.
To add more plugins, pass them to `satteri({ mdastPlugins, hastPlugins })` in
`astro.config.mjs`. GFM (tables, footnotes, task lists, strikethrough) is on
by default; math, directives and similar features can be switched on with
`satteri({ features: { ... } })`.

---

## Deployment

The build output in `dist/` is plain static files, so any static host works.
Set **`SITE_URL`** to your real origin at build time. It is used for canonical
URLs, the RSS feed and the sitemap:

```bash
SITE_URL=https://yourdomain.com npm run build
```

(Or change the fallback in `astro.config.mjs`.)

The site expects to be served from the root of a domain, e.g.
`https://yourdomain.com/` or `https://you.github.io/`, not from a sub-path.

### Netlify / Vercel / Cloudflare Pages

Connect the repository and use:

| setting          | value                 |
| ---------------- | --------------------- |
| build command    | `npm run build`       |
| output directory | `dist`                |
| Node version     | 22 or newer           |
| env var          | `SITE_URL=https://…`  |

All three detect Astro automatically; you mostly just need to add `SITE_URL`.

### GitHub Pages

Use a repository named `<user>.github.io`, or attach a custom domain. Then add
`.github/workflows/deploy.yml`:

```yaml
name: deploy
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm run build
        env: { SITE_URL: 'https://<user>.github.io' }
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages }
    steps:
      - uses: actions/deploy-pages@v4
```

Then set **Settings → Pages → Source** to "GitHub Actions".

### Any other server

```bash
SITE_URL=https://yourdomain.com npm run build
rsync -avz --delete dist/ you@server:/var/www/site/
```

---

## Troubleshooting

- **A link points to a renamed wiki note.** Rendered Markdown is cached
  between dev runs. `npm run build` always starts clean; for dev, restart with
  `npx astro dev --force`.
- **"Invalid frontmatter" during build.** The error names the file and field;
  compare it with the schema in `src/content.config.ts`.
