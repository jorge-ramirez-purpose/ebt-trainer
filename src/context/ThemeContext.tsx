import { createContext, useContext, useState } from "react";
import type { TThemeMode } from "../types/question";

type TThemeColors = {
  pageBg: string;
  cardBg: string;
  cardHoverBg: string;
  cardBorder: string;
  surfaceBg: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentBg: string;
  accentText: string;
  accentHoverBg: string;
  accentHoverText: string;
  secondaryBtnBg: string;
  secondaryBtnText: string;
  secondaryBtnHover: string;
  tertiaryBtnBg: string;
  tertiaryBtnText: string;
  tertiaryBtnHover: string;
  optionDefault: string;
  optionSelected: string;
  optionLabelBg: string;
  optionLabelText: string;
  progressBarBg: string;
  progressBarFill: string;
  badgeCumulativeBg: string;
  badgeCumulativeText: string;
  divider: string;
  correctText: string;
  correctBadgeBg: string;
  correctBadgeText: string;
  correctFeedbackBg: string;
  correctFeedbackText: string;
  wrongFeedbackBg: string;
  wrongFeedbackText: string;
  correctOptionBg: string;
  wrongOptionBg: string;
  wrongText: string;
  scoreText: string;
};

type TThemeContext = {
  mode: TThemeMode;
  toggle: () => void;
  colors: TThemeColors;
};

const darkColors: TThemeColors = {
  pageBg: "bg-[#0a0a0a]",
  cardBg: "bg-[#141414]",
  cardHoverBg: "hover:bg-[#1c1c1c]",
  cardBorder: "border-[#2a2a2a]",
  surfaceBg: "bg-[#1a1a1a]",
  surfaceBorder: "border-[#2a2a2a]",
  textPrimary: "text-neutral-100",
  textSecondary: "text-neutral-200",
  textMuted: "text-neutral-500",
  accentBg: "bg-amber-600",
  accentText: "text-amber-400",
  accentHoverBg: "hover:bg-amber-500",
  accentHoverText: "hover:text-amber-300",
  secondaryBtnBg: "bg-[#2a2a2a]",
  secondaryBtnText: "text-neutral-200",
  secondaryBtnHover: "hover:bg-[#353535]",
  tertiaryBtnBg: "bg-[#1a1a1a]",
  tertiaryBtnText: "text-neutral-400",
  tertiaryBtnHover: "hover:bg-[#222222]",
  optionDefault: "bg-[#1a1a1a] border-[#2a2a2a] text-neutral-200 hover:bg-[#222222] hover:border-[#3a3a3a]",
  optionSelected: "bg-[#2a2008] border-amber-500 text-amber-100",
  optionLabelBg: "bg-[#0a0a0a]",
  optionLabelText: "text-neutral-500",
  progressBarBg: "bg-[#1a1a1a]",
  progressBarFill: "bg-gradient-to-r from-amber-600 to-amber-400",
  badgeCumulativeBg: "bg-amber-950",
  badgeCumulativeText: "text-amber-400",
  divider: "border-[#2a2a2a]",
  correctText: "text-green-400",
  correctBadgeBg: "bg-green-950",
  correctBadgeText: "text-green-400",
  correctFeedbackBg: "bg-green-950",
  correctFeedbackText: "text-green-300",
  wrongFeedbackBg: "bg-red-950",
  wrongFeedbackText: "text-red-300",
  correctOptionBg: "bg-green-950 border-green-400 text-green-200",
  wrongOptionBg: "bg-red-950 border-red-400 text-red-200",
  wrongText: "text-red-400",
  scoreText: "text-red-400",
};

const lightColors: TThemeColors = {
  pageBg: "bg-[#f5f0e8]",
  cardBg: "bg-white",
  cardHoverBg: "hover:bg-[#f5f0e8]",
  cardBorder: "border-[#e0d5c3]",
  surfaceBg: "bg-[#f9f6f1]",
  surfaceBorder: "border-[#e0d5c3]",
  textPrimary: "text-neutral-900",
  textSecondary: "text-neutral-800",
  textMuted: "text-neutral-400",
  accentBg: "bg-amber-500",
  accentText: "text-amber-700",
  accentHoverBg: "hover:bg-amber-400",
  accentHoverText: "hover:text-amber-600",
  secondaryBtnBg: "bg-[#ebe3d5]",
  secondaryBtnText: "text-neutral-700",
  secondaryBtnHover: "hover:bg-[#e0d5c3]",
  tertiaryBtnBg: "bg-[#f0ebe3]",
  tertiaryBtnText: "text-neutral-500",
  tertiaryBtnHover: "hover:bg-[#e8e0d3]",
  optionDefault: "bg-[#f9f6f1] border-[#e0d5c3] text-neutral-800 hover:bg-[#f0ebe3] hover:border-[#d5c8b3]",
  optionSelected: "bg-amber-50 border-amber-400 text-amber-900",
  optionLabelBg: "bg-[#ebe3d5]",
  optionLabelText: "text-neutral-500",
  progressBarBg: "bg-[#ebe3d5]",
  progressBarFill: "bg-gradient-to-r from-amber-500 to-amber-400",
  badgeCumulativeBg: "bg-amber-100",
  badgeCumulativeText: "text-amber-700",
  divider: "border-[#e0d5c3]",
  correctText: "text-green-700",
  correctBadgeBg: "bg-green-100",
  correctBadgeText: "text-green-700",
  correctFeedbackBg: "bg-green-100",
  correctFeedbackText: "text-green-800",
  wrongFeedbackBg: "bg-red-100",
  wrongFeedbackText: "text-red-800",
  correctOptionBg: "bg-green-100 border-green-500 text-green-900",
  wrongOptionBg: "bg-red-100 border-red-500 text-red-900",
  wrongText: "text-red-600",
  scoreText: "text-red-600",
};

const THEME_STORAGE_KEY = "ebt-theme";

const ThemeContext = createContext<TThemeContext>({
  mode: "dark",
  toggle: () => {},
  colors: darkColors,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<TThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  };

  const colors = mode === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, toggle, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
