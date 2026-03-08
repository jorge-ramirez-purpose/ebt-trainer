import { TOTAL_DAYS } from "../constants/labels";
import { getDayQuestionRange } from "../utils/dayHelpers";
import type { TExamMode } from "../types/question";
import type { TProgressMap } from "../utils/storage";
import { useTheme } from "../context/ThemeContext";

type TProps = {
  onSelectDay: (day: number, mode: TExamMode) => void;
  progress: TProgressMap;
};

export const DaySelectScreen = ({ onSelectDay, progress }: TProps) => {
  const { mode, colors } = useTheme();
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);

  return (
    <div className={`min-h-screen ${colors.pageBg} flex items-center justify-center p-4 font-serif`}>
      <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 w-full max-w-[900px] shadow-2xl`}>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex gap-0.5">
              <div className={`w-1 h-5 rounded-sm ${mode === "dark" ? "bg-[#0a0a0a]" : "bg-neutral-800"}`} />
              <div className="w-1 h-5 rounded-sm bg-red-600" />
              <div className="w-1 h-5 rounded-sm bg-amber-400" />
            </div>
            <h1 className={`text-xl font-extrabold ${colors.textPrimary} font-sans`}>
              Einbürgerungstest Trainer
            </h1>
          </div>
          <p className={`text-sm ${colors.textMuted} mt-1 font-sans`}>
            310 Fragen &middot; 33 pro Tag &middot; 10 Tage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {days.map((day) => {
            const range = getDayQuestionRange(day);
            const dayProgress = progress[day];
            const todayBest = dayProgress?.todayBest ?? null;
            const cumulativeBest = dayProgress?.cumulativeBest ?? null;

            return (
              <div
                key={day}
                className={`${colors.surfaceBg} rounded-xl border ${colors.surfaceBorder} p-4`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className={`text-sm font-bold ${colors.textSecondary} font-sans`}>
                      Tag {day}
                    </div>
                    <div className={`text-xs ${colors.textMuted} font-sans mt-0.5`}>
                      Fragen {range.start}&ndash;{range.end}
                      {range.count < 33 && ` (${range.count} Fragen)`}
                    </div>
                  </div>
                  <div className="flex gap-2 text-right">
                    {todayBest !== null && (
                      <span className="text-xs text-green-400 bg-green-950 rounded-full px-2 py-0.5 font-sans font-semibold">
                        Tages: {todayBest}/{range.count}
                      </span>
                    )}
                    {cumulativeBest !== null && (
                      <span className={`text-xs ${colors.badgeCumulativeText} ${colors.badgeCumulativeBg} rounded-full px-2 py-0.5 font-sans font-semibold`}>
                        Alle: {cumulativeBest}/33
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className={`flex-1 ${colors.accentBg} text-white rounded-lg px-3 py-2 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.accentHoverBg}`}
                    onClick={() => onSelectDay(day, "today")}
                  >
                    Tagesfragen
                  </button>
                  <button
                    className={`flex-1 ${colors.secondaryBtnBg} ${colors.secondaryBtnText} rounded-lg px-3 py-2 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.secondaryBtnHover}`}
                    onClick={() => onSelectDay(day, "cumulative")}
                  >
                    Alle bisherigen
                  </button>
                  <button
                    className={`flex-1 ${colors.tertiaryBtnBg} ${colors.tertiaryBtnText} rounded-lg px-3 py-2 text-sm font-bold font-sans cursor-pointer transition-colors ${colors.tertiaryBtnHover}`}
                    onClick={() => onSelectDay(day, "study")}
                  >
                    Lernen
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`text-center text-xs ${colors.textMuted} mt-6 font-sans`}>
          Developed by{" "}
          <a
            href="https://github.com/jorge-ramirez-purpose"
            target="_blank"
            rel="noreferrer"
            className={`underline ${colors.textPrimary} hover:text-amber-400`}
          >
            Jorge Ram&iacute;rez
          </a>{" "}
          and Claude
        </div>
      </div>
    </div>
  );
};
