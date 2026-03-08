import { describe, it, expect } from "vitest";
import { shuffle } from "../shuffle";

describe("shuffle", () => {
  it("returns a new array with the same elements", () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original);
    expect(result).toHaveLength(original.length);
    expect(result.sort()).toEqual(original.sort());
  });

  it("does not mutate the original array", () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffle(original);
    expect(original).toEqual(copy);
  });

  it("returns an empty array when given an empty array", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("returns a single-element array unchanged", () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it("produces different orderings across multiple runs", () => {
    const original = Array.from({ length: 20 }, (_, index) => index);
    const results = Array.from({ length: 10 }, () => shuffle(original));
    const allIdentical = results.every(
      (result) => JSON.stringify(result) === JSON.stringify(results[0])
    );
    expect(allIdentical).toBe(false);
  });
});
