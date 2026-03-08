import type { TExamMode } from "../types/question";

export type TModeSlug = "tagesfragen" | "alle-bisherigen" | "lernen";

const MODE_TO_SLUG: Record<TExamMode, TModeSlug> = {
  today: "tagesfragen",
  cumulative: "alle-bisherigen",
  study: "lernen",
};

const SLUG_TO_MODE: Record<TModeSlug, TExamMode> = {
  tagesfragen: "today",
  "alle-bisherigen": "cumulative",
  lernen: "study",
};

export const getModeFromSlug = (slug: string): TExamMode | null =>
  SLUG_TO_MODE[slug as TModeSlug] ?? null;

export const buildPath = (day: number, mode: TExamMode): string =>
  `/tag/${day}/${MODE_TO_SLUG[mode]}`;
