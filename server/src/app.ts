import express from "express";
import cors from "cors";
import { config } from "./config";
import { questionRouter } from "./routes/questionRoutes";
import { errorHandler } from "./middleware/errorHandler";

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  app.use("/api/questions", questionRouter);

  app.use(errorHandler);

  return app;
};
