import { describe, it, expect } from "vitest";
import { getOptionState } from "../getOptionState";

describe("getOptionState", () => {
  const correctAnswer = 2;

  describe("before confirmation", () => {
    it("returns 'default' when nothing is selected", () => {
      expect(getOptionState(0, null, false, correctAnswer)).toBe("default");
    });

    it("returns 'selected' for the selected option", () => {
      expect(getOptionState(1, 1, false, correctAnswer)).toBe("selected");
    });

    it("returns 'default' for non-selected options", () => {
      expect(getOptionState(0, 1, false, correctAnswer)).toBe("default");
    });
  });

  describe("after confirmation", () => {
    it("returns 'correct' for the correct answer", () => {
      expect(getOptionState(correctAnswer, 1, true, correctAnswer)).toBe("correct");
    });

    it("returns 'wrong' for the selected wrong answer", () => {
      expect(getOptionState(1, 1, true, correctAnswer)).toBe("wrong");
    });

    it("returns 'default' for unselected wrong options", () => {
      expect(getOptionState(0, 1, true, correctAnswer)).toBe("default");
    });

    it("returns 'correct' when the selected option is the correct answer", () => {
      expect(getOptionState(correctAnswer, correctAnswer, true, correctAnswer)).toBe("correct");
    });
  });
});
