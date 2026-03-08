import { describe, it, expect } from "vitest";
import { getQuestionsForDay, getCumulativeQuestions, buildQuizSet, getDayQuestionRange } from "../dayHelpers";
import { QUESTIONS_PER_DAY } from "../../constants/labels";

describe("getQuestionsForDay", () => {
  it("returns 33 questions for day 1", () => {
    const result = getQuestionsForDay(1);
    expect(result).toHaveLength(QUESTIONS_PER_DAY);
    expect(result[0]!.id).toBe(1);
  });

  it("returns questions starting at the correct offset for day 3", () => {
    const result = getQuestionsForDay(3);
    expect(result[0]!.id).toBe(67);
  });

  it("returns fewer questions for day 10 (last day)", () => {
    const result = getQuestionsForDay(10);
    expect(result.length).toBeLessThanOrEqual(QUESTIONS_PER_DAY);
    expect(result[0]!.id).toBe(298);
  });
});

describe("getCumulativeQuestions", () => {
  it("returns 33 questions for day 1", () => {
    expect(getCumulativeQuestions(1)).toHaveLength(QUESTIONS_PER_DAY);
  });

  it("returns 66 questions for day 2", () => {
    expect(getCumulativeQuestions(2)).toHaveLength(QUESTIONS_PER_DAY * 2);
  });

  it("includes questions from all previous days", () => {
    const result = getCumulativeQuestions(3);
    expect(result[0]!.id).toBe(1);
    expect(result).toHaveLength(QUESTIONS_PER_DAY * 3);
  });
});

describe("buildQuizSet", () => {
  it("returns shuffled questions for 'today' mode", () => {
    const result = buildQuizSet(1, "today");
    expect(result).toHaveLength(QUESTIONS_PER_DAY);
    const ids = result.map((question) => question.id).sort((first, second) => first - second);
    const expectedIds = Array.from({ length: QUESTIONS_PER_DAY }, (_, index) => index + 1);
    expect(ids).toEqual(expectedIds);
  });

  it("returns 33 questions for 'cumulative' mode", () => {
    const result = buildQuizSet(5, "cumulative");
    expect(result).toHaveLength(QUESTIONS_PER_DAY);
  });

  it("shuffles answer options", () => {
    const original = getQuestionsForDay(1);
    const quizSet = buildQuizSet(1, "today");
    const someOptionsShuffled = quizSet.some((quizQuestion) => {
      const originalQuestion = original.find((item) => item.id === quizQuestion.id)!;
      return quizQuestion.options[0] !== originalQuestion.options[0];
    });
    expect(someOptionsShuffled).toBe(true);
  });

  it("maintains correct answer mapping after shuffling", () => {
    const original = getQuestionsForDay(1);
    const quizSet = buildQuizSet(1, "today");
    for (const quizQuestion of quizSet) {
      const originalQuestion = original.find((item) => item.id === quizQuestion.id)!;
      const correctOption = originalQuestion.options[originalQuestion.answer];
      expect(quizQuestion.options[quizQuestion.answer]).toBe(correctOption);
    }
  });
});

describe("getDayQuestionRange", () => {
  it("returns correct range for day 1", () => {
    expect(getDayQuestionRange(1)).toEqual({ start: 1, end: 33, count: 33 });
  });

  it("returns correct range for day 2", () => {
    expect(getDayQuestionRange(2)).toEqual({ start: 34, end: 66, count: 33 });
  });

  it("returns correct range for day 10", () => {
    const range = getDayQuestionRange(10);
    expect(range.start).toBe(298);
    expect(range.end).toBe(310);
    expect(range.count).toBe(13);
  });
});
