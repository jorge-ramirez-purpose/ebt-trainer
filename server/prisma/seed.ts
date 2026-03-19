import { PrismaClient } from "@prisma/client";
import { questions } from "../../src/data/questions";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.question.deleteMany();

  await prisma.question.createMany({
    data: questions.map((question) => ({
      id: question.id,
      question: question.question,
      optionA: question.options[0],
      optionB: question.options[1],
      optionC: question.options[2],
      optionD: question.options[3],
      answer: question.answer,
    })),
  });

  console.log(`Seeded ${questions.length} questions.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
