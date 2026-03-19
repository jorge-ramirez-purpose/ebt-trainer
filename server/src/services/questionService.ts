import { PrismaClient, Question } from "@prisma/client";
import type { TQuestion, TQuestionInput } from "../types/question";

const prisma = new PrismaClient();

const toTQuestion = (row: Question): TQuestion => ({
  id: row.id,
  question: row.question,
  options: [row.optionA, row.optionB, row.optionC, row.optionD],
  answer: row.answer as 0 | 1 | 2 | 3,
});

const fromTQuestion = (data: TQuestionInput) => ({
  question: data.question,
  optionA: data.options[0],
  optionB: data.options[1],
  optionC: data.options[2],
  optionD: data.options[3],
  answer: data.answer,
});

export const getAllQuestions = async (day?: number): Promise<TQuestion[]> => {
  if (day !== undefined) {
    const questionsPerDay = 33;
    const start = (day - 1) * questionsPerDay + 1;
    const end = day * questionsPerDay;
    const rows = await prisma.question.findMany({
      where: { id: { gte: start, lte: end } },
      orderBy: { id: "asc" },
    });
    return rows.map(toTQuestion);
  }

  const rows = await prisma.question.findMany({ orderBy: { id: "asc" } });
  return rows.map(toTQuestion);
};

export const getQuestionById = async (id: number): Promise<TQuestion | null> => {
  const row = await prisma.question.findUnique({ where: { id } });
  return row ? toTQuestion(row) : null;
};

export const createQuestion = async (data: TQuestionInput): Promise<TQuestion> => {
  const last = await prisma.question.findFirst({ orderBy: { id: "desc" } });
  const nextId = (last?.id ?? 0) + 1;
  const row = await prisma.question.create({
    data: { id: nextId, ...fromTQuestion(data) },
  });
  return toTQuestion(row);
};

export const updateQuestion = async (
  id: number,
  data: TQuestionInput
): Promise<TQuestion | null> => {
  const existing = await prisma.question.findUnique({ where: { id } });
  if (!existing) return null;
  const row = await prisma.question.update({
    where: { id },
    data: fromTQuestion(data),
  });
  return toTQuestion(row);
};

export const deleteQuestion = async (id: number): Promise<boolean> => {
  const existing = await prisma.question.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.question.delete({ where: { id } });
  return true;
};
