import { questions as staticQuestions } from "../data/questions";
import type { TQuestion } from "../types/question";

export const fetchAllQuestions = async (): Promise<TQuestion[]> => {
  try {
    const response = await fetch("/api/questions");
    if (!response.ok) throw new Error("API error");
    const json = await response.json();
    return json.data as TQuestion[];
  } catch {
    console.warn("API unavailable, falling back to static data");
    return staticQuestions;
  }
};

export const fetchQuestionsForDay = async (day: number): Promise<TQuestion[]> => {
  try {
    const response = await fetch(`/api/questions?day=${day}`);
    if (!response.ok) throw new Error("API error");
    const json = await response.json();
    return json.data as TQuestion[];
  } catch {
    console.warn("API unavailable, falling back to static data");
    const questionsPerDay = 33;
    const start = (day - 1) * questionsPerDay;
    return staticQuestions.slice(start, start + questionsPerDay);
  }
};
