import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsScreen } from "../ResultsScreen";
import { ThemeProvider } from "../../context/ThemeContext";
import { questions } from "../../data/questions";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe("ResultsScreen", () => {
  const defaultProps = {
    score: 25,
    total: 33,
    wrongAnswers: [],
    examLabel: "Tag 1 – Tagesfragen",
    questions,
    onRetry: vi.fn(),
    onGoHome: vi.fn(),
    onReview: vi.fn(),
  };

  it("displays the score", () => {
    renderWithTheme(<ResultsScreen {...defaultProps} />);
    expect(screen.getByText("25/33")).toBeInTheDocument();
  });

  it("shows pass message when score >= 17", () => {
    renderWithTheme(<ResultsScreen {...defaultProps} score={17} />);
    expect(screen.getByText("Gut gemacht!")).toBeInTheDocument();
  });

  it("shows fail message when score < 17", () => {
    renderWithTheme(<ResultsScreen {...defaultProps} score={10} />);
    expect(screen.getByText("Weiter üben!")).toBeInTheDocument();
  });

  it("shows percentage", () => {
    renderWithTheme(<ResultsScreen {...defaultProps} />);
    expect(screen.getByText("76% richtig")).toBeInTheDocument();
  });

  it("shows retry button", () => {
    renderWithTheme(<ResultsScreen {...defaultProps} />);
    expect(screen.getByText("Nochmal versuchen")).toBeInTheDocument();
  });

  it("shows review button when there are wrong answers", () => {
    const wrongAnswers = [{ questionId: 1, selected: 1, correct: false }];
    renderWithTheme(<ResultsScreen {...defaultProps} wrongAnswers={wrongAnswers} />);
    expect(screen.getByText("Falsche wiederholen")).toBeInTheDocument();
  });

  it("hides review button when all answers are correct", () => {
    renderWithTheme(<ResultsScreen {...defaultProps} wrongAnswers={[]} />);
    expect(screen.queryByText("Falsche wiederholen")).not.toBeInTheDocument();
  });

  it("calls onRetry when clicking retry button", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<ResultsScreen {...defaultProps} onRetry={onRetry} />);
    await user.click(screen.getByText("Nochmal versuchen"));
    expect(onRetry).toHaveBeenCalled();
  });

  it("calls onGoHome when clicking home button", async () => {
    const onGoHome = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<ResultsScreen {...defaultProps} onGoHome={onGoHome} />);
    await user.click(screen.getByText("Zur Übersicht"));
    expect(onGoHome).toHaveBeenCalled();
  });
});
