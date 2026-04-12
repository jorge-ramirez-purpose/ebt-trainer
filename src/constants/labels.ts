export const LABELS = ["A", "B", "C", "D"] as const;
export const PASSING_SCORE = 17;
export const QUESTIONS_PER_DAY = 33;
export const TOTAL_QUESTIONS = 310;
export const TOTAL_DAYS = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_DAY);
export const STORAGE_KEY = "ebt-progress";
export const MARKED_KEY = "ebt-marked";
