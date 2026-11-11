import { site } from '~/site.config';

const pad = (n: number) => String(n).padStart(2, '0');

/** 2026-11-11 — the house date format. Always UTC so builds are reproducible. */
export const isoDay = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** "nov 2026" */
export const monthYear = (d: Date) =>
  d.toLocaleDateString(site.locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).toLowerCase();

/** 14:05 */
export const clock = (d: Date) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;

export const wordCount = (text = '') =>
  text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

/** ~220 wpm, rounded up, minimum 1 */
export const readingTime = (text = '') => Math.max(1, Math.ceil(wordCount(text) / 220));

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
