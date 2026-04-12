import { useNavigate } from "react-router";
import { useMarked } from "../context/MarkedContext";
import { useTheme } from "../context/ThemeContext";
import { questions } from "../data/questions";
import { StudyScreen } from "../components/StudyScreen";

export const MarkedRoute = () => {
  const navigate = useNavigate();
  const { markedIds } = useMarked();
  const { colors } = useTheme();

  const markedQuestions = questions.filter((question) =>
    markedIds.has(question.id),
  );

  if (markedQuestions.length === 0) {
    return (
      <div className={`min-h-screen ${colors.pageBg} flex items-center justify-center p-4 font-serif`}>
        <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-8 w-full max-w-[620px] shadow-2xl text-center`}>
          <button
            className={`text-xs uppercase tracking-wider ${colors.accentText} font-bold font-sans ${colors.accentHoverText} cursor-pointer transition-colors block mb-6`}
            onClick={() => navigate("/")}
          >
            &larr; Startseite
          </button>
          <div className="text-4xl mb-4">&#9734;</div>
          <div className={`text-sm ${colors.textMuted} font-sans`}>
            Noch keine markierten Fragen.
          </div>
        </div>
      </div>
    );
  }

  return (
    <StudyScreen
      questions={markedQuestions}
      examLabel="Markierte Fragen"
      onGoHome={() => navigate("/")}
    />
  );
};
