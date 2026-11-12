import { spriteSvg } from '~/lib/icons';

/** The favicon is the resident cat, the same sprite as the header. */
export function GET() {
  return new Response(spriteSvg('cat', '#1f1d1a', '#e6d89a'), { headers: { 'Content-Type': 'image/svg+xml' } });
}
