import { QUESTIONS_PER_DAY, TOTAL_QUESTIONS } from "../constants/labels";
import { shuffle } from "./shuffle";
import type { TQuestion, TExamMode } from "../types/question";

export const getQuestionsForDay = (day: number, questions: TQuestion[]): TQuestion[] => {
  const start = (day - 1) * QUESTIONS_PER_DAY;
  return questions.slice(start, start + QUESTIONS_PER_DAY);
};

export const getCumulativeQuestions = (day: number, questions: TQuestion[]): TQuestion[] => {
  const end = day * QUESTIONS_PER_DAY;
  return questions.slice(0, end);
};

const shuffleOptions = (question: TQuestion): TQuestion => {
  const indices = shuffle([0, 1, 2, 3] as const);
  return {
    ...question,
    options: indices.map((idx) => question.options[idx]) as TQuestion["options"],
    answer: indices.indexOf(question.answer) as TQuestion["answer"],
  };
};

export const buildQuizSet = (day: number, mode: TExamMode, questions: TQuestion[]): TQuestion[] => {
  if (mode === "today") {
    return shuffle(getQuestionsForDay(day, questions)).map(shuffleOptions);
  }
  const pool = getCumulativeQuestions(day, questions);
  return shuffle(pool).slice(0, QUESTIONS_PER_DAY).map(shuffleOptions);
};

export const getDayQuestionRange = (day: number): { start: number; end: number; count: number } => {
  const start = (day - 1) * QUESTIONS_PER_DAY + 1;
  const end = Math.min(day * QUESTIONS_PER_DAY, TOTAL_QUESTIONS);
  return { start, end, count: end - start + 1 };
};
