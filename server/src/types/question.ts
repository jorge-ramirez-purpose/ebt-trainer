export type TQuestion = {
  id: number;
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
};

export type TQuestionInput = {
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
};
