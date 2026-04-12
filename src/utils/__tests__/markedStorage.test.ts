import { describe, it, expect, beforeEach } from "vitest";
import { loadMarked, saveMarked, toggleMarked } from "../markedStorage";
import { MARKED_KEY } from "../../constants/labels";

describe("markedStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadMarked", () => {
    it("returns empty array when no data exists", () => {
      expect(loadMarked()).toEqual([]);
    });

    it("returns parsed array from localStorage", () => {
      localStorage.setItem(MARKED_KEY, JSON.stringify([1, 5, 42]));
      expect(loadMarked()).toEqual([1, 5, 42]);
    });

    it("returns empty array on invalid JSON", () => {
      localStorage.setItem(MARKED_KEY, "not-json");
      expect(loadMarked()).toEqual([]);
    });
  });

  describe("saveMarked", () => {
    it("saves the array to localStorage", () => {
      saveMarked([3, 7, 99]);
      expect(JSON.parse(localStorage.getItem(MARKED_KEY)!)).toEqual([3, 7, 99]);
    });

    it("overwrites existing data", () => {
      saveMarked([1, 2]);
      saveMarked([5, 6]);
      expect(JSON.parse(localStorage.getItem(MARKED_KEY)!)).toEqual([5, 6]);
    });
  });

  describe("toggleMarked", () => {
    it("adds an id that is not in the set", () => {
      const result = toggleMarked(10, new Set([1, 2]));
      expect(result).toContain(10);
      expect(result).toContain(1);
      expect(result).toContain(2);
    });

    it("removes an id that is already in the set", () => {
      const result = toggleMarked(2, new Set([1, 2, 3]));
      expect(result).not.toContain(2);
      expect(result).toContain(1);
      expect(result).toContain(3);
    });

    it("returns an empty array when removing the only id", () => {
      const result = toggleMarked(5, new Set([5]));
      expect(result).toEqual([]);
    });

    it("does not mutate the original set", () => {
      const original = new Set([1, 2, 3]);
      toggleMarked(2, original);
      expect(original.has(2)).toBe(true);
    });
  });
});
