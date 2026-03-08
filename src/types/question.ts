export type TQuestion = {
  id: number;
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
};

export type TResult = {
  questionId: number;
  selected: number;
  correct: boolean;
};

export type TOptionState = "default" | "selected" | "correct" | "wrong";

export type TExamMode = "today" | "cumulative" | "study";

export type TScreen = "home" | "quiz" | "results" | "review" | "study";

export type TDayProgress = {
  todayBest: number | null;
  cumulativeBest: number | null;
};

export type TThemeMode = "dark" | "light";
