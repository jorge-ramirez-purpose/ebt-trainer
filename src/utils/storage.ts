import { STORAGE_KEY } from "../constants/labels";
import type { TDayProgress } from "../types/question";

export type TProgressMap = Record<number, TDayProgress>;

export const loadProgress = (): TProgressMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveScore = (day: number, mode: "today" | "cumulative", score: number): void => {
  const progress = loadProgress();
  const entry = progress[day] ?? { todayBest: null, cumulativeBest: null };
  const key = mode === "today" ? "todayBest" : "cumulativeBest";
  if (entry[key] === null || score > entry[key]) {
    entry[key] = score;
  }
  progress[day] = entry;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};
