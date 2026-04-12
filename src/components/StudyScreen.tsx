import type { TQuestion } from "../types/question";
import { useTheme } from "../context/ThemeContext";
import { useMarked } from "../context/MarkedContext";

type TProps = {
  questions: TQuestion[];
  examLabel: string;
  onGoHome: () => void;
};

export const StudyScreen = ({ questions, examLabel, onGoHome }: TProps) => {
  const { colors } = useTheme();
  const { markedIds, toggleMark } = useMarked();

  return (
    <div className={`min-h-screen ${colors.pageBg} p-4 font-serif`}>
      <div className="max-w-[1100px] mx-auto">
        <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 shadow-2xl mb-4`}>
          <div className="flex justify-between items-center">
            <button
              className={`text-xs uppercase tracking-wider ${colors.accentText} font-bold font-sans ${colors.accentHoverText} cursor-pointer transition-colors`}
              onClick={onGoHome}
            >
              &larr; {examLabel}
            </button>
            <span className={`text-sm ${colors.textMuted} font-sans`}>
              {questions.length} Fragen
            </span>
          </div>
        </div>

        <div className="columns-1 md:columns-2 gap-3 space-y-3">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`${colors.cardBg} ${colors.cardHoverBg} rounded-xl border ${colors.cardBorder} p-4 break-inside-avoid transition-colors`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs ${colors.textMuted} uppercase tracking-widest font-sans`}>
                  Frage {question.id}
                </span>
                <button
                  className={`text-base cursor-pointer transition-colors ${markedIds.has(question.id) ? colors.accentText : colors.textMuted}`}
                  onClick={() => toggleMark(question.id)}
                >
                  {markedIds.has(question.id) ? "\u2605" : "\u2606"}
                </button>
              </div>
              <div className={`text-sm ${colors.textSecondary} leading-relaxed mb-2 font-semibold`}>
                {question.question}
              </div>
              {question.imageUrl && (
                <img
                  src={question.imageUrl}
                  alt={`Bild zu Frage ${question.id}`}
                  className="max-h-[200px] rounded-lg mb-2 mx-auto block"
                />
              )}
              <div className={`text-sm ${colors.correctText} font-sans font-semibold`}>
                &#10003; {question.options[question.answer]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
