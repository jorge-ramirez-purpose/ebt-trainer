import type { TOptionState } from "../types/question";

export const getOptionState = (
  index: number,
  selected: number | null,
  confirmed: boolean,
  correctAnswer: number,
): TOptionState => {
  if (confirmed) {
    if (index === correctAnswer) return "correct";
    if (index === selected) return "wrong";
    return "default";
  }
  if (selected === index) return "selected";
  return "default";
};
