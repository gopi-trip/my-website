import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const md = (base: string) => glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${base}` });

const tags = z.array(z.string()).default([]);
const links = z
  .object({
    repo: z.url().optional(),
    demo: z.url().optional(),
    paper: z.url().optional(),
    arxiv: z.url().optional(),
    pdf: z.string().optional(),
    code: z.url().optional(),
  })
  .partial()
  .default({});

/** Long-form articles. */
const writings = defineCollection({
  loader: md('writings'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    kind: z.enum(['technical', 'personal']).default('technical'),
    tags,
    draft: z.boolean().default(false),
  }),
});

/** Things I've built. */
const projects = defineCollection({
  loader: md('projects'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    status: z.enum(['active', 'paused', 'done', 'archived']).default('active'),
    stack: z.array(z.string()).default([]),
    tags,
    links,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** Papers, experiments and open research questions. */
const research = defineCollection({
  loader: md('research'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['paper', 'experiment', 'interest']),
    venue: z.string().optional(),
    authors: z.array(z.string()).default([]),
    status: z.enum(['ongoing', 'published', 'abandoned', 'idea']).default('ongoing'),
    tags,
    links,
    draft: z.boolean().default(false),
  }),
});

/** Digital-garden notes. Folders become categories: wiki/ml/attention.md -> "ml". */
const wiki = defineCollection({
  loader: md('wiki'),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    stage: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
    tags,
    draft: z.boolean().default(false),
  }),
});

/** Microblog: one file per thought. The body *is* the post. */
const micro = defineCollection({
  loader: md('micro'),
  schema: z.object({
    date: z.coerce.date(),
    tags,
    draft: z.boolean().default(false),
  }),
});

/** /now snapshots. The newest one is the /now page; older ones form the archive. */
const now = defineCollection({
  loader: md('now'),
  schema: z.object({
    date: z.coerce.date(),
    /** one line, shown on the home page */
    summary: z.string(),
    location: z.string().optional(),
  }),
});

/** Bookshelf: a single YAML file, one entry per book or paper. */
const shelf = defineCollection({
  loader: file('./src/content/bookshelf.yaml'),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    year: z.number().optional(),
    type: z.enum(['book', 'paper']).default('book'),
    status: z.enum(['reading', 'read', 'queued', 'abandoned']),
    finished: z.coerce.date().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    note: z.string().optional(),
    link: z.url().optional(),
    tags,
  }),
});

/** Free-standing prose pages (home intro, about). */
const pages = defineCollection({
  loader: md('pages'),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { writings, projects, research, wiki, micro, now, shelf, pages };
