import { describe, it, expect, beforeEach } from "vitest";
import { loadProgress, saveScore } from "../storage";
import { STORAGE_KEY } from "../../constants/labels";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadProgress", () => {
    it("returns empty object when no data exists", () => {
      expect(loadProgress()).toEqual({});
    });

    it("returns parsed data from localStorage", () => {
      const data = { 1: { todayBest: 25, cumulativeBest: 30 } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      expect(loadProgress()).toEqual(data);
    });

    it("returns empty object on invalid JSON", () => {
      localStorage.setItem(STORAGE_KEY, "not-json");
      expect(loadProgress()).toEqual({});
    });
  });

  describe("saveScore", () => {
    it("saves a new score for today mode", () => {
      saveScore(1, "today", 20);
      const progress = loadProgress();
      expect(progress[1]!.todayBest).toBe(20);
      expect(progress[1]!.cumulativeBest).toBeNull();
    });

    it("saves a new score for cumulative mode", () => {
      saveScore(1, "cumulative", 28);
      const progress = loadProgress();
      expect(progress[1]!.cumulativeBest).toBe(28);
      expect(progress[1]!.todayBest).toBeNull();
    });

    it("does not overwrite a higher score with a lower one", () => {
      saveScore(1, "today", 30);
      saveScore(1, "today", 20);
      expect(loadProgress()[1]!.todayBest).toBe(30);
    });

    it("overwrites a lower score with a higher one", () => {
      saveScore(1, "today", 20);
      saveScore(1, "today", 30);
      expect(loadProgress()[1]!.todayBest).toBe(30);
    });

    it("saves scores for different days independently", () => {
      saveScore(1, "today", 25);
      saveScore(2, "today", 30);
      const progress = loadProgress();
      expect(progress[1]!.todayBest).toBe(25);
      expect(progress[2]!.todayBest).toBe(30);
    });
  });
});
