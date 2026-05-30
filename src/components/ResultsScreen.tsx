import type { TResult, TQuestion } from "../types/question";
import { PASSING_SCORE } from "../constants/labels";
import { useTheme } from "../context/ThemeContext";

type TProps = {
  score: number;
  total: number;
  wrongAnswers: TResult[];
  examLabel: string;
  questions: TQuestion[];
  onRetry: () => void;
  onGoHome: () => void;
  onReview: () => void;
};

export const ResultsScreen = ({
  score,
  total,
  wrongAnswers,
  examLabel,
  questions,
  onRetry,
  onGoHome,
  onReview,
}: TProps) => {
  const { colors } = useTheme();
  const pct = Math.round((score / total) * 100);
  const passed = score >= PASSING_SCORE;

  return (
    <div className={`min-h-screen ${colors.pageBg} flex items-center justify-center p-4 font-serif`}>
      <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 w-full max-w-[620px] shadow-2xl`}>
        <div className="text-center py-8 px-4">
          <div className={`text-xs uppercase tracking-wider ${colors.accentText} font-bold font-sans mb-4`}>
              {examLabel}
            </div>
            <div className="text-6xl mb-2">{passed ? "\u{1F389}" : "\u{1F4DA}"}</div>
          <h1 className={`text-2xl font-extrabold ${colors.textPrimary} mb-2`}>
            {passed ? "Gut gemacht!" : "Weiter üben!"}
          </h1>
          <div
            className={`text-5xl font-extrabold my-4 font-serif ${passed ? colors.correctText : colors.scoreText}`}
          >
            {score}/{total}
          </div>
          <div className={`text-base ${colors.textMuted} mb-1`}>{pct}% richtig</div>
          <div className={`text-sm ${colors.textMuted} mb-8`}>
            Zum Bestehen brauchst du mind. {PASSING_SCORE} richtige Antworten
          </div>

          {wrongAnswers.length > 0 && (
            <div className={`${colors.surfaceBg} rounded-xl p-4 mb-6 text-left`}>
              <div className={`text-xs ${colors.textMuted} mb-3 font-semibold uppercase tracking-wider`}>
                Falsch beantwortet ({wrongAnswers.length})
              </div>
              {wrongAnswers.map((result) => {
                const wrongQuestion = questions.find((item) => item.id === result.questionId)!;
                return (
                  <div
                    key={result.questionId}
                    className={`text-sm ${colors.textSecondary} mb-2 pb-2 border-b ${colors.divider}`}
                  >
                    <span className={`${colors.wrongText} font-bold`}>#{wrongQuestion.id}</span>{" "}
                    {wrongQuestion.question}
                    <div className={`${colors.correctText} mt-0.5`}>
                      &#10003; {wrongQuestion.options[wrongQuestion.answer]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              className={`${colors.accentBg} text-white rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.accentHoverBg}`}
              onClick={onRetry}
            >
              Nochmal versuchen
            </button>
            {wrongAnswers.length > 0 && (
              <button
                className={`${colors.secondaryBtnBg} ${colors.secondaryBtnText} rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.secondaryBtnHover}`}
                onClick={onReview}
              >
                Falsche wiederholen
              </button>
            )}
            <button
              className={`${colors.tertiaryBtnBg} ${colors.tertiaryBtnText} rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.tertiaryBtnHover}`}
              onClick={onGoHome}
            >
              Zur Übersicht
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
