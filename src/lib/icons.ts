/**
 * Hand-drawn pixel icons. Each icon is a grid of characters:
 *   '#' = ink (currentColor)   '+' = accent   '.' = empty
 * <Pixel> turns these into crisp SVG rects, so icons scale without blur
 * and recolour with the surrounding text. Draw new ones right here.
 */
const grids = {
  house: `
...##...
..####..
.######.
########
.#....#.
.#.##.#.
.#.##.#.
.######.`,
  person: `
...##...
..####..
..####..
...##...
.######.
#.####.#
..#..#..
..#..#..`,
  quill: `
......##
.....###
....###.
...###..
..###...
.###....
.#......
#.......`,
  floppy: `
########
#.++++.#
#.++#+.#
#.++++.#
#......#
#.####.#
#.####.#
########`,
  flask: `
..####..
...##...
...##...
..#..#..
.#....#.
#.++++.#
#++++++#
.######.`,
  sprout: `
##.....##
###...###
.###.###.
...#.#...
....#....
....#....
.#######.
..#####..`,
  book: `
.#######
#+.....#
#+.###.#
#+.....#
#+.###.#
#+.....#
#+.....#
.#######`,
  bubble: `
.######.
#......#
#.#.##.#
#......#
.######.
..#.....
.#......
........`,
  clock: `
..####..
.#..#.#.
#...#..#
#...##.#
#......#
#......#
.#....#.
..####..`,
  rss: `
##......
..##....
....#...
##...#..
..#...#.
...#..#.
##..#..#
##..#..#`,
  arrow: `
..#..
...#.
#####
...#.
..#..`,
  back: `
..#..
.#...
#####
.#...
..#..`,
  sun: `
#..#..#
.#...#.
..###..
#.###.#
..###..
.#...#.
#..#..#`,
  moon: `
..###..
.##....
##.....
##.....
##.....
.##...#
..####.`,
  heart: `
.##.##.
#######
#######
.#####.
..###..
...#...`,
  seedling: `
.......
.......
....##.
...##..
...#...
...#...
.#####.`,
  budding: `
.......
.##.##.
..#.#..
...#...
...#...
...#...
.#####.`,
  evergreen: `
...#...
..###..
.#####.
..###..
.#####.
#######
...#...`,
  star: `
...#...
...#...
#######
.#####.
..###..
.##.##.
.#...#.`,
  tag: `
####...
#..##..
#.#..#.
#.....#
.#...#.
..#.#..
...#...`,
} as const;

export type IconName = keyof typeof grids;

export type Run = { x: number; y: number; w: number; tone: 'ink' | 'accent' };

/** Parse a grid into horizontal runs (fewer rects than one-per-pixel). */
function parseGrid(grid: string): { w: number; h: number; runs: Run[] } {
  const rows = grid.trim().split('\n').map((r) => r.trim());
  const runs: Run[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === '#' || c === '+') {
        let w = 1;
        while (row[x + w] === c) w++;
        runs.push({ x, y, w, tone: c === '#' ? 'ink' : 'accent' });
        x += w;
      } else x++;
    }
  });
  return { w: Math.max(...rows.map((r) => r.length)), h: rows.length, runs };
}

export function iconRuns(name: IconName) {
  return parseGrid(grids[name]);
}

/** Standalone SVG string (for favicons / OG images). */
export function iconSvg(name: IconName, ink = '#1f1d1a', accent = '#d9c98f', bg?: string) {
  const { w, h, runs } = iconRuns(name);
  const rects = runs
    .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${r.tone === 'ink' ? ink : accent}"/>`)
    .join('');
  const back = bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${back}${rects}</svg>`;
}

/**
 * Animated pixel sprites: a set of frames (same grid format as above, all the
 * same size) and a sequence of [frame, slots] to play on a loop. One slot lasts
 * `slot` ms. <Sprite> renders them inline; /favicon.svg is the same sprite.
 */
const sprites = {
  /** the resident: a small cat who licks its paw and hops about. avatar + favicon */
  cat: {
    slot: 140,
    frames: {
    sit: `
..............
..............
..#.....#.....
..#+...+#.....
..#######.....
..#+###+#.....
..###+###.....
...#####......
..#######.....
..#######.....
..#######...#.
..#######...#.
..#######..##.
...##.##.###..`,
    blink: `
..............
..............
..#.....#.....
..#+...+#.....
..#######.....
..#######.....
..###+###.....
...#####......
..#######.....
..#######.....
..#######...#.
..#######...#.
..#######..##.
...##.##.###..`,
    lickA: `
..............
..............
..#.....#.....
..#+...+#.....
..#######.....
..#######.....
##.##+###.....
##+#####......
.########.....
..#######.....
..#######...#.
..#######...#.
..#######..##.
......##.###..`,
    lickB: `
..............
..............
...#.....#....
...#+...+#....
...#######....
...#######....
...###+###....
##.+#####.....
##########....
..#######.....
..#######...#.
..#######...#.
..#######..##.
......##.###..`,
    crouch: `
..............
..............
..............
..............
..#.....#.....
..#+...+#.....
..#######.....
..#+###+#.....
..###+###.....
.#########....
###########.#.
###########.#.
###########.#.
.##..##..###..`,
    air: `
..#.....#.....
..#+...+#.....
..#######..#..
..#+###+#..#..
..###+###..#..
...#####...#..
..#######.#...
..#######.#...
..#########...
..#######.....
..##...##.....
..#.....#.....
..............
..............`,
    land: `
..............
..............
..............
..#.....#.....
..#+...+#.....
..#######.....
..#+###+#.....
..###+###.....
..#######.....
.#########....
.#########..#.
.#########..#.
.#########.##.
.##.....####..`,
    },
    sequence: [
    ['sit', 8],
    ['blink', 1],
    ['sit', 5],
    ['lickA', 2],
    ['lickB', 2],
    ['lickA', 2],
    ['lickB', 2],
    ['lickA', 2],
    ['lickB', 2],
    ['sit', 6],
    ['crouch', 3],
    ['air', 3],
    ['land', 2],
    ['sit', 6],
    ['crouch', 2],
    ['air', 3],
    ['land', 2],
    ['sit', 4],
    ],
  },
} as const;

export type SpriteName = keyof typeof sprites;

export type Sprite = { w: number; h: number; slot: number; frames: Run[][]; sequence: number[] };

/** Parse a sprite into per-frame runs and a flat per-slot sequence of frame indices. */
export function spriteData(name: SpriteName): Sprite {
  const s = sprites[name];
  const names = Object.keys(s.frames) as (keyof typeof s.frames)[];
  const parsed = names.map((n) => parseGrid(s.frames[n]));
  const sequence = s.sequence.flatMap(([n, k]) => Array<number>(k).fill(names.indexOf(n)));
  return { w: parsed[0].w, h: parsed[0].h, slot: s.slot, frames: parsed.map((p) => p.runs), sequence };
}

/**
 * CSS that shows one frame group at a time. Frame groups carry the class
 * `${prefix}-f${i}`. Reduced-motion visitors get the first frame, still.
 */
export function spriteCss(name: SpriteName, prefix: string = `spr-${name}`) {
  const { frames, sequence, slot } = spriteData(name);
  const n = sequence.length;
  const pct = (i: number) => `${+((i / n) * 100).toFixed(3)}%`;
  const rules = frames.map((_, f) => {
    const stops: string[] = [];
    let prev: boolean | undefined;
    sequence.forEach((s, i) => {
      const on = s === f;
      if (on !== prev) stops.push(`${pct(i)}{opacity:${on ? 1 : 0}}`);
      prev = on;
    });
    stops.push(`100%{opacity:${prev ? 1 : 0}}`);
    return `@keyframes ${prefix}-f${f}{${stops.join('')}}.${prefix}-f${f}{opacity:${sequence[0] === f ? 1 : 0};animation:${prefix}-f${f} ${n * slot}ms steps(1,end) infinite}`;
  });
  const first = sequence[0];
  const still = frames.map((_, f) => `.${prefix}-f${f}{animation:none;opacity:${f === first ? 1 : 0}}`).join('');
  return `${rules.join('')}@media (prefers-reduced-motion:reduce){${still}}`;
}

const rectsSvg = (runs: Run[], ink: string, accent: string) =>
  runs.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${r.tone === 'ink' ? ink : accent}"/>`).join('');

/** Standalone animated SVG of a sprite (the favicon; Firefox animates it in the tab). */
export function spriteSvg(name: SpriteName, ink = '#1f1d1a', accent = '#d9c98f') {
  const { w, h, frames } = spriteData(name);
  const prefix = `spr-${name}`;
  const groups = frames.map((runs, f) => `<g class="${prefix}-f${f}">${rectsSvg(runs, ink, accent)}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><style>${spriteCss(name, prefix)}</style>${groups}</svg>`;
}

/** One still frame of a sprite as a standalone SVG. */
export function spriteFrameSvg(name: SpriteName, frame: number, ink = '#1f1d1a', accent = '#d9c98f') {
  const { w, h, frames } = spriteData(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rectsSvg(frames[frame], ink, accent)}</svg>`;
}
