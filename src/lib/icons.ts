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
  /** the resident: a small monitor with a face. used as avatar + favicon */
  resident: `
.##########.
#..........#
#.++++++++.#
#.+#++++#+.#
#.++++++++.#
#.++#++#++.#
#.+++##+++.#
#..........#
.##########.
....####....
..########..
............`,
} as const;

export type IconName = keyof typeof grids;

export type Run = { x: number; y: number; w: number; tone: 'ink' | 'accent' };

/** Parse a grid into horizontal runs (fewer rects than one-per-pixel). */
export function iconRuns(name: IconName): { w: number; h: number; runs: Run[] } {
  const rows = grids[name].trim().split('\n').map((r) => r.trim());
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

/** Standalone SVG string (for favicons / OG images). */
export function iconSvg(name: IconName, ink = '#1f1d1a', accent = '#d9c98f', bg?: string) {
  const { w, h, runs } = iconRuns(name);
  const rects = runs
    .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${r.tone === 'ink' ? ink : accent}"/>`)
    .join('');
  const back = bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${back}${rects}</svg>`;
}
