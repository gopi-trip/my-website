import { iconSvg } from '~/lib/icons';

/** The favicon is the resident, drawn from the same pixel grid as the header. */
export function GET() {
  return new Response(iconSvg('resident', '#1f1d1a', '#e6d89a'), { headers: { 'Content-Type': 'image/svg+xml' } });
}
