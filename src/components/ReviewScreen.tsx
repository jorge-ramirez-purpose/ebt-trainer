import { useState, useMemo } from "react";
import type { TQuestion } from "../types/question";
import { LABELS } from "../constants/labels";
import { getOptionState } from "../utils/getOptionState";
import { OptionButton } from "./OptionButton";
import { shuffle } from "../utils/shuffle";
import { useTheme } from "../context/ThemeContext";
import { useMarked } from "../context/MarkedContext";

type TProps = {
  wrongQuestions: TQuestion[];
  onFinish: () => void;
  onGoHome: () => void;
};

export const ReviewScreen = ({ wrongQuestions, onFinish, onGoHome }: TProps) => {
  const { colors } = useTheme();
  const { markedIds, toggleMark } = useMarked();
  const shuffled = useMemo(
    () =>
      wrongQuestions.map((item) => {
        const indices = shuffle([0, 1, 2, 3] as const);
        return {
          ...item,
          options: indices.map((idx) => item.options[idx]) as TQuestion["options"],
          answer: indices.indexOf(item.answer) as TQuestion["answer"],
        };
      }),
    [wrongQuestions],
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const question = shuffled[index]!;

  const handleNext = () => {
    setSelected(null);
    setConfirmed(false);
    setIndex(index + 1);
  };

  return (
    <div className={`min-h-screen ${colors.pageBg} flex items-center justify-center p-4 font-serif`}>
      <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 w-full max-w-[620px] shadow-2xl`}>
        <div className="flex justify-between items-center mb-4">
          <button
            className={`text-xs uppercase tracking-wider ${colors.accentText} font-bold font-sans ${colors.accentHoverText} cursor-pointer transition-colors`}
            onClick={onGoHome}
          >
            &larr; Wiederholung
          </button>
          <span className={`text-sm ${colors.textMuted} font-sans`}>
            {index + 1} / {shuffled.length}
          </span>
        </div>

        <div className="flex justify-between items-center mb-1.5">
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

        <div className={`text-[1.05rem] ${colors.textSecondary} leading-relaxed mb-5 font-semibold`}>
          {question.question}
        </div>

        {question.imageUrl && (
          <img
            src={question.imageUrl}
            alt={`Bild zu Frage ${question.id}`}
            className="max-h-[200px] rounded-lg mb-5 mx-auto block"
          />
        )}

        <div className="flex flex-col gap-2.5 mb-5">
          {question.options.map((option, optionIndex) => (
            <OptionButton
              key={optionIndex}
              label={LABELS[optionIndex]!}
              text={option}
              state={getOptionState(optionIndex, selected, confirmed, question.answer)}
              disabled={confirmed}
              onClick={() => {
                if (!confirmed) setSelected(optionIndex);
              }}
            />
          ))}
        </div>

        <div className="flex justify-end">
          {!confirmed ? (
            <button
              className={`${colors.accentBg} text-white rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.accentHoverBg} ${selected === null ? "opacity-40" : ""}`}
              onClick={() => {
                if (selected !== null) setConfirmed(true);
              }}
            >
              Bestätigen
            </button>
          ) : index + 1 < shuffled.length ? (
            <button
              className={`${colors.accentBg} text-white rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.accentHoverBg}`}
              onClick={handleNext}
            >
              Weiter &rarr;
            </button>
          ) : (
            <button
              className={`${colors.accentBg} text-white rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.accentHoverBg}`}
              onClick={onFinish}
            >
              Fertig
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
