/**
 * Everything about *you* that isn't a piece of content lives here.
 * Edit freely — no component hard-codes your name, links or nav.
 */
import type { IconName } from '~/lib/icons';

export const site = {
  name: 'gop-trip',
  /** shown under the name in the header */
  tagline: 'a small corner of the internet, tended by hand',
  description:
    'Personal site of gop-trip: writings, projects, research notes, a wiki, a bookshelf and a microblog.',
  author: 'gop-trip',
  /** started tending this garden in... (shown in the footer) */
  since: 2026,
  lang: 'en',
  locale: 'en-GB',
} as const;

export type NavItem = { href: string; label: string; icon: IconName; blurb: string };

/** Primary navigation. Order here is order everywhere (header, home map, footer). */
export const nav: NavItem[] = [
  { href: '/about/', label: 'about', icon: 'person', blurb: 'who lives here' },
  { href: '/writings/', label: 'writings', icon: 'quill', blurb: 'long-form, technical & personal' },
  { href: '/projects/', label: 'projects', icon: 'floppy', blurb: 'software, ml, research code' },
  { href: '/research/', label: 'research', icon: 'flask', blurb: 'papers, experiments, open questions' },
  { href: '/wiki/', label: 'wiki', icon: 'sprout', blurb: 'notes that grow over time' },
  { href: '/bookshelf/', label: 'bookshelf', icon: 'book', blurb: 'read, reading, someday' },
  { href: '/micro/', label: 'micro', icon: 'bubble', blurb: 'short thoughts' },
  { href: '/now/', label: 'now', icon: 'clock', blurb: 'what i’m up to lately' },
];

/** Elsewhere on the internet. Remove what you don't use; `href` can be mailto:. */
export const elsewhere: { label: string; href: string }[] = [
  { label: 'github', href: 'https://github.com/gop-trip' },
  { label: 'rss', href: '/rss.xml' },
];
