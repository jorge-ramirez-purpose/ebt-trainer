import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import { StudyScreen } from "../components/StudyScreen";
import { fetchQuestionsForDay } from "../api/questionsApi";
import { TOTAL_DAYS } from "../constants/labels";
import type { TQuestion } from "../types/question";

export const StudyRoute = () => {
  const { day: dayParam } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const day = Number(dayParam);

  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const isValid = !isNaN(day) && day >= 1 && day <= TOTAL_DAYS;

  useEffect(() => {
    if (!isValid) return;
    fetchQuestionsForDay(day).then((fetched) => {
      setQuestions(fetched);
      setLoading(false);
    });
  }, [day, isValid]);

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">Laden...</span>
      </div>
    );
  }

  return (
    <StudyScreen
      questions={questions}
      examLabel={`Tag ${day} \u2013 Lernen`}
      onGoHome={() => navigate("/")}
    />
  );
};
