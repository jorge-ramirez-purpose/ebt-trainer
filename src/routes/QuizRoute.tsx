import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import { questions as allQuestions } from "../data/questions";
import { buildQuizSet } from "../utils/dayHelpers";
import { saveScore } from "../utils/storage";
import { getModeFromSlug } from "../constants/routes";
import { TOTAL_DAYS } from "../constants/labels";
import { QuizScreen } from "../components/QuizScreen";
import { ResultsScreen } from "../components/ResultsScreen";
import { ReviewScreen } from "../components/ReviewScreen";
import type { TResult, TQuizPhase } from "../types/question";

export const QuizRoute = () => {
  const { day: dayParam, modeSlug } = useParams<{ day: string; modeSlug: string }>();
  const navigate = useNavigate();

  const day = Number(dayParam);
  const examMode = getModeFromSlug(modeSlug ?? "");

  const [phase, setPhase] = useState<TQuizPhase>("quiz");
  const [quizQuestions, setQuizQuestions] = useState(allQuestions.slice(0, 0));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState<TResult[]>([]);

  const isValid = !isNaN(day) && day >= 1 && day <= TOTAL_DAYS && examMode !== null && examMode !== "study";

  useEffect(() => {
    if (!isValid || !examMode) return;
    setQuizQuestions(buildQuizSet(day, examMode));
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setResults([]);
    setPhase("quiz");
  }, [day, examMode, isValid]);

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  const question = quizQuestions[current];
  const score = results.filter((result) => result.correct).length;
  const wrongAnswers = results.filter((result) => !result.correct);

  const examLabel =
    examMode === "today"
      ? `Tag ${day} \u2013 Tagesfragen`
      : `Tag ${day} \u2013 Alle bisherigen`;

  const handleGoHome = () => navigate("/");

  const handleSelect = (optionIndex: number) => {
    if (confirmed) return;
    setSelected(optionIndex);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
  };

  const handleNext = () => {
    const newResults: TResult[] = [
      ...results,
      { questionId: question!.id, selected: selected!, correct: selected === question!.answer },
    ];
    setResults(newResults);
    if (current + 1 >= quizQuestions.length) {
      const newScore = newResults.filter((result) => result.correct).length;
      saveScore(day, examMode!, newScore);
      setPhase("results");
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleRetry = () => {
    setQuizQuestions(buildQuizSet(day, examMode!));
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setResults([]);
    setPhase("quiz");
  };

  if (phase === "review") {
    const wrongQuestionIds = wrongAnswers.map((result) => result.questionId);
    const reviewQuestions = allQuestions.filter((item) => wrongQuestionIds.includes(item.id));
    return <ReviewScreen wrongQuestions={reviewQuestions} onFinish={handleGoHome} onGoHome={handleGoHome} />;
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        score={score}
        total={quizQuestions.length}
        wrongAnswers={wrongAnswers}
        examLabel={examLabel}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
        onReview={() => setPhase("review")}
      />
    );
  }

  if (!question) return null;

  return (
    <QuizScreen
      question={question}
      current={current}
      total={quizQuestions.length}
      score={score}
      selected={selected}
      confirmed={confirmed}
      examLabel={examLabel}
      onSelect={handleSelect}
      onConfirm={handleConfirm}
      onNext={handleNext}
      onGoHome={handleGoHome}
      isLast={current + 1 >= quizQuestions.length}
    />
  );
};
