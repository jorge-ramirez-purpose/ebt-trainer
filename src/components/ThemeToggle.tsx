import { SunIcon, MoonIcon } from "@phosphor-icons/react";
import { useTheme } from "../context/ThemeContext";

export const ThemeToggle = () => {
  const { mode, toggle } = useTheme();

  return (
    <button
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors bg-[#1a1a1a] hover:bg-[#2a2a2a] text-amber-400 border border-[#2a2a2a] data-[light=true]:bg-[#ebe3d5] data-[light=true]:hover:bg-[#e0d5c3] data-[light=true]:text-amber-600 data-[light=true]:border-[#e0d5c3]"
      data-light={mode === "light"}
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mode === "dark" ? <SunIcon size={20} weight="bold" /> : <MoonIcon size={20} weight="bold" />}
    </button>
  );
};
