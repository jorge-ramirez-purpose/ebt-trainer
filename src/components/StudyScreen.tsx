import { useState } from "react";
import type { TQuestion } from "../types/question";
import { LABELS } from "../constants/labels";
import { useTheme } from "../context/ThemeContext";

type TProps = {
  questions: TQuestion[];
  examLabel: string;
  onGoHome: () => void;
};

export const StudyScreen = ({ questions, examLabel, onGoHome }: TProps) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const question = questions[currentIndex]!;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

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
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className={`h-1 ${colors.progressBarBg} rounded-full mb-5 overflow-hidden`}>
          <div
            className={`h-full ${colors.progressBarFill} rounded-full transition-all duration-400`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={`text-xs ${colors.textMuted} uppercase tracking-widest font-sans mb-1.5`}>
          Frage {question.id}
        </div>
        <div className={`text-[1.05rem] ${colors.textSecondary} leading-relaxed mb-5 font-semibold`}>
          {question.question}
        </div>

        <div className="flex flex-col gap-2.5 mb-5">
          {question.options.map((option, optionIndex) => {
            const isCorrect = optionIndex === question.answer;
            const stateClass = isCorrect
              ? "bg-green-950 border-green-400 text-green-200"
              : `${colors.optionDefault} opacity-50`;

            return (
              <div
                key={optionIndex}
                className={`flex items-start gap-3 w-full rounded-[10px] border-[1.5px] px-4 py-3 text-left text-sm leading-relaxed font-sans transition-all duration-150 ${stateClass}`}
              >
                <span className={`flex min-w-[22px] h-[22px] items-center justify-center rounded-full ${isCorrect ? "bg-green-800 text-green-200" : `${colors.optionLabelBg} ${colors.optionLabelText}`} text-xs font-extrabold shrink-0 mt-px`}>
                  {LABELS[optionIndex]}
                </span>
                <span>{option}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between">
          <button
            className={`${colors.secondaryBtnBg} ${colors.secondaryBtnText} rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.secondaryBtnHover} ${currentIndex === 0 ? "opacity-40 cursor-default" : ""}`}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            &larr; Zurück
          </button>
          <button
            className={`${colors.accentBg} text-white rounded-[10px] px-6 py-2.5 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.accentHoverBg} ${currentIndex === questions.length - 1 ? "opacity-40 cursor-default" : ""}`}
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            Weiter &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
