import { useParams, useNavigate, Navigate } from "react-router";
import { StudyScreen } from "../components/StudyScreen";
import { getQuestionsForDay } from "../utils/dayHelpers";
import { TOTAL_DAYS } from "../constants/labels";

export const StudyRoute = () => {
  const { day: dayParam } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const day = Number(dayParam);

  if (isNaN(day) || day < 1 || day > TOTAL_DAYS) {
    return <Navigate to="/" replace />;
  }

  const questions = getQuestionsForDay(day);

  return (
    <StudyScreen
      questions={questions}
      examLabel={`Tag ${day} \u2013 Lernen`}
      onGoHome={() => navigate("/")}
    />
  );
};
