import { useState } from "react";
import { useNavigate } from "react-router";
import { DaySelectScreen } from "../components/DaySelectScreen";
import { loadProgress } from "../utils/storage";
import { buildPath } from "../constants/routes";
import type { TExamMode } from "../types/question";

export const HomeRoute = () => {
  const navigate = useNavigate();
  const [progress] = useState(() => loadProgress());

  const handleSelectDay = (day: number, mode: TExamMode) => {
    navigate(buildPath(day, mode));
  };

  return <DaySelectScreen onSelectDay={handleSelectDay} progress={progress} />;
};
