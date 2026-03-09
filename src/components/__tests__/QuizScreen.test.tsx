import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuizScreen } from "../QuizScreen";
import { ThemeProvider } from "../../context/ThemeContext";
import type { TQuestion } from "../../types/question";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

const mockQuestion: TQuestion = {
  id: 1,
  question: "Was war am 8. Mai 1945?",
  options: [
    "Ende des Zweiten Weltkriegs in Europa",
    "Tod Adolf Hitlers",
    "Wahl von Konrad Adenauer zum Bundeskanzler",
    "Beginn des Berliner Mauerbaus",
  ],
  answer: 0,
};

describe("QuizScreen", () => {
  const defaultProps = {
    question: mockQuestion,
    current: 0,
    total: 33,
    score: 0,
    selected: null as number | null,
    confirmed: false,
    examLabel: "Tag 1 – Tagesfragen",
    onSelect: vi.fn(),
    onConfirm: vi.fn(),
    onNext: vi.fn(),
    onGoHome: vi.fn(),
    isLast: false,
    autoAdvance: false,
  };

  it("renders the question text", () => {
    renderWithTheme(<QuizScreen {...defaultProps} />);
    expect(screen.getByText("Was war am 8. Mai 1945?")).toBeInTheDocument();
  });

  it("renders all four options", () => {
    renderWithTheme(<QuizScreen {...defaultProps} />);
    expect(screen.getByText("Ende des Zweiten Weltkriegs in Europa")).toBeInTheDocument();
    expect(screen.getByText("Tod Adolf Hitlers")).toBeInTheDocument();
    expect(screen.getByText("Wahl von Konrad Adenauer zum Bundeskanzler")).toBeInTheDocument();
    expect(screen.getByText("Beginn des Berliner Mauerbaus")).toBeInTheDocument();
  });

  it("shows progress counter", () => {
    renderWithTheme(<QuizScreen {...defaultProps} />);
    expect(screen.getByText("1 / 33")).toBeInTheDocument();
  });

  it("shows Bestätigen button when not confirmed", () => {
    renderWithTheme(<QuizScreen {...defaultProps} />);
    expect(screen.getByText("Bestätigen")).toBeInTheDocument();
  });

  it("shows Weiter button after confirmation", () => {
    renderWithTheme(<QuizScreen {...defaultProps} confirmed={true} selected={0} />);
    expect(screen.getByText(/Weiter/)).toBeInTheDocument();
  });

  it("shows Ergebnis anzeigen on the last question", () => {
    renderWithTheme(<QuizScreen {...defaultProps} confirmed={true} selected={0} isLast={true} />);
    expect(screen.getByText("Ergebnis anzeigen")).toBeInTheDocument();
  });

  it("calls onSelect when clicking an option", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<QuizScreen {...defaultProps} onSelect={onSelect} />);
    await user.click(screen.getByText("Tod Adolf Hitlers"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("calls onConfirm when clicking Bestätigen", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<QuizScreen {...defaultProps} selected={0} onConfirm={onConfirm} />);
    await user.click(screen.getByText("Bestätigen"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("shows correct feedback after confirming the right answer", () => {
    renderWithTheme(<QuizScreen {...defaultProps} confirmed={true} selected={0} />);
    expect(screen.getByText("✓ Richtig!")).toBeInTheDocument();
  });

  it("shows wrong feedback after confirming the wrong answer", () => {
    renderWithTheme(<QuizScreen {...defaultProps} confirmed={true} selected={1} />);
    expect(screen.getByText(/Falsch/)).toBeInTheDocument();
  });

  it("calls onGoHome when clicking the back button", async () => {
    const onGoHome = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<QuizScreen {...defaultProps} onGoHome={onGoHome} />);
    await user.click(screen.getByText(/Tag 1/));
    expect(onGoHome).toHaveBeenCalled();
  });
});
