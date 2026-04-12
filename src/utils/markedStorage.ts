import { MARKED_KEY } from "../constants/labels";

export const loadMarked = (): number[] => {
  try {
    const raw = localStorage.getItem(MARKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveMarked = (ids: number[]): void => {
  localStorage.setItem(MARKED_KEY, JSON.stringify(ids));
};

export const toggleMarked = (id: number, current: Set<number>): number[] => {
  const updated = new Set(current);
  if (updated.has(id)) updated.delete(id);
  else updated.add(id);
  return Array.from(updated);
};
