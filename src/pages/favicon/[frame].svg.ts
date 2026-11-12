import type { APIContext } from 'astro';
import { spriteData, spriteFrameSvg } from '~/lib/icons';

/**
 * Still frames of the favicon cat. Most browsers only show the first frame of
 * an animated SVG favicon, so a tiny script in <BaseHead> flips through these.
 */
export function getStaticPaths() {
  return spriteData('cat').frames.map((_, i) => ({ params: { frame: String(i) } }));
}

export function GET({ params }: APIContext) {
  return new Response(spriteFrameSvg('cat', Number(params.frame), '#1f1d1a', '#e6d89a'), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
