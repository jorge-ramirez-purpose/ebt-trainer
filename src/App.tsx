import { useState } from "react";
import { questions } from "./data/questions";
import type { TResult, TScreen, TExamMode } from "./types/question";
import { buildQuizSet } from "./utils/dayHelpers";
import { loadProgress, saveScore } from "./utils/storage";
import type { TProgressMap } from "./utils/storage";
import { DaySelectScreen } from "./components/DaySelectScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { ReviewScreen } from "./components/ReviewScreen";

const App = () => {
  const [screen, setScreen] = useState<TScreen>("home");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [examMode, setExamMode] = useState<TExamMode>("today");
  const [progress, setProgress] = useState<TProgressMap>(() => loadProgress());

  const [quizQuestions, setQuizQuestions] = useState(questions.slice(0, 0));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState<TResult[]>([]);

  const question = quizQuestions[current];
  const score = results.filter((result) => result.correct).length;
  const wrongAnswers = results.filter((result) => !result.correct);

  const examLabel =
    examMode === "today"
      ? `Tag ${selectedDay} \u2013 Tagesfragen`
      : `Tag ${selectedDay} \u2013 Alle bisherigen`;

  const handleStartExam = (day: number, mode: TExamMode) => {
    const quizSet = buildQuizSet(day, mode);
    setSelectedDay(day);
    setExamMode(mode);
    setQuizQuestions(quizSet);
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setResults([]);
    setScreen("quiz");
  };

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
      saveScore(selectedDay, examMode, newScore);
      setProgress(loadProgress());
      setScreen("results");
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleRetry = () => {
    handleStartExam(selectedDay, examMode);
  };

  const handleGoHome = () => {
    setScreen("home");
    setResults([]);
  };

  if (screen === "home") {
    return <DaySelectScreen onSelectDay={handleStartExam} progress={progress} />;
  }

  if (screen === "review") {
    const wrongQuestionIds = wrongAnswers.map((result) => result.questionId);
    const reviewQuestions = questions.filter((item) => wrongQuestionIds.includes(item.id));
    return <ReviewScreen wrongQuestions={reviewQuestions} onFinish={handleGoHome} onGoHome={handleGoHome} />;
  }

  if (screen === "results") {
    return (
      <ResultsScreen
        score={score}
        total={quizQuestions.length}
        wrongAnswers={wrongAnswers}
        examLabel={examLabel}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
        onReview={() => setScreen("review")}
      />
    );
  }

  return (
    <QuizScreen
      question={question!}
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

export default App;
