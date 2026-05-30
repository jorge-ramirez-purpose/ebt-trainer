import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateRequest } from "../middleware/validateRequest";
import * as questionService from "../services/questionService";

export const questionRouter = Router();

const questionSchema = z.object({
  question: z.string().min(1),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  answer: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

questionRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const day = req.query.day ? Number(req.query.day) : undefined;
    const questions = await questionService.getAllQuestions(day);
    res.json({ data: questions });
  } catch (error) {
    next(error);
  }
});

questionRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await questionService.getQuestionById(Number(req.params.id));
    if (!question) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ data: question });
  } catch (error) {
    next(error);
  }
});

questionRouter.post(
  "/",
  validateRequest(questionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await questionService.createQuestion(req.body);
      res.status(201).json({ data: question });
    } catch (error) {
      next(error);
    }
  }
);

questionRouter.put(
  "/:id",
  validateRequest(questionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await questionService.updateQuestion(Number(req.params.id), req.body);
      if (!question) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json({ data: question });
    } catch (error) {
      next(error);
    }
  }
);

questionRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await questionService.deleteQuestion(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
