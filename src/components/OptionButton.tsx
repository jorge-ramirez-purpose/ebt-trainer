import type { TOptionState } from "../types/question";
import { useTheme } from "../context/ThemeContext";

type TProps = {
  label: string;
  text: string;
  state: TOptionState;
  disabled: boolean;
  onClick: () => void;
};

export const OptionButton = ({ label, text, state, disabled, onClick }: TProps) => {
  const { colors } = useTheme();

  const stateClass =
    state === "correct"
      ? "bg-green-950 border-green-400 text-green-200"
      : state === "wrong"
        ? "bg-red-950 border-red-400 text-red-200"
        : state === "selected"
          ? colors.optionSelected
          : colors.optionDefault;

  return (
    <button
      className={`flex items-start gap-3 w-full rounded-[10px] border-[1.5px] px-4 py-3 text-left text-sm leading-relaxed font-sans transition-all duration-150 ${stateClass} ${disabled ? "cursor-default" : "cursor-pointer"}`}
      onClick={onClick}
    >
      <span className={`flex min-w-[22px] h-[22px] items-center justify-center rounded-full ${colors.optionLabelBg} text-xs font-extrabold ${colors.optionLabelText} shrink-0 mt-px`}>
        {label}
      </span>
      <span>{text}</span>
    </button>
  );
};
