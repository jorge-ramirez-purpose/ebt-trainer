import type { TQuestion } from "../types/question";
import { LABELS } from "../constants/labels";
import { getOptionState } from "../utils/getOptionState";
import { OptionButton } from "./OptionButton";
import { useTheme } from "../context/ThemeContext";

type TProps = {
  question: TQuestion;
  current: number;
  total: number;
  score: number;
  selected: number | null;
  confirmed: boolean;
  examLabel: string;
  onSelect: (index: number) => void;
  onConfirm: () => void;
  onNext: () => void;
  onGoHome: () => void;
  isLast: boolean;
};

export const QuizScreen = ({
  question,
  current,
  total,
  score,
  selected,
  confirmed,
  examLabel,
  onSelect,
  onConfirm,
  onNext,
  onGoHome,
  isLast,
}: TProps) => {
  const { colors } = useTheme();
  const progress = (current / total) * 100;

  return (
    <div className={`min-h-screen ${colors.pageBg} flex items-center justify-center p-4 font-serif`}>
      <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 w-full max-w-[620px] shadow-2xl`}>
        <div className="flex justify-between items-center mb-4">
          <button
            className={`text-xs uppercase tracking-wider ${colors.accentText} font-bold font-sans ${colors.accentHoverText} cursor-pointer transition-colors`}
            onClick={onGoHome}
          >
            &larr; {examLabel}
          </button>
          <span className={`text-sm ${colors.textMuted} font-sans`}>
            {current + 1} / {total}
          </span>
        </div>

        <div className={`h-1 ${colors.progressBarBg} rounded-full mb-5 overflow-hidden`}>
          <div
            className={`h-full ${colors.progressBarFill} rounded-full transition-all duration-400`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="inline-block text-xs text-green-400 bg-green-950 rounded-full px-3 py-0.5 mb-5 font-sans font-semibold">
          &#10003; {score} richtig
        </span>

        <div className={`text-xs ${colors.textMuted} uppercase tracking-widest font-sans mb-1.5`}>
          Frage {question.id}
        </div>
        <div className={`text-[1.05rem] ${colors.textSecondary} leading-relaxed mb-5 font-semibold`}>
          {question.question}
        </div>

        <div className="flex flex-col gap-2.5 mb-5">
          {question.options.map((option, optionIndex) => (
            <OptionButton
              key={optionIndex}
              label={LABELS[optionIndex]!}
              text={option}
              state={getOptionState(optionIndex, selected, confirmed, question.answer)}
              disabled={confirmed}
              onClick={() => onSelect(optionIndex)}
            />
          ))}
        </div>

        {confirmed && (
          <div
            className={`mb-4 px-4 py-3 rounded-[10px] text-sm font-semibold ${
              selected === question.answer
                ? "bg-green-950 text-green-300"
                : "bg-red-950 text-red-300"
            }`}
          >
            {selected === question.answer
              ? "\u2713 Richtig!"
              : `\u2717 Falsch. Richtig: ${LABELS[question.answer]} \u2013 ${question.options[question.answer]}`}
          </div>
        )}

        <div className="flex justify-end">
          {!confirmed ? (
            <button
              className={`${colors.accentBg} text-white rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.accentHoverBg} ${selected === null ? "opacity-40" : ""}`}
              onClick={onConfirm}
            >
              Bestätigen
            </button>
          ) : (
            <button
              className={`${colors.accentBg} text-white rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.accentHoverBg}`}
              onClick={onNext}
            >
              {isLast ? "Ergebnis anzeigen" : "Weiter \u2192"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
