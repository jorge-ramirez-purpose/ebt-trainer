import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DaySelectScreen } from "../DaySelectScreen";
import { ThemeProvider } from "../../context/ThemeContext";
import { TOTAL_DAYS } from "../../constants/labels";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe("DaySelectScreen", () => {
  const mockOnSelectDay = vi.fn();
  const mockOnGoMarked = vi.fn();

  it("renders all 10 day cards", () => {
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={mockOnGoMarked} progress={{}} />);
    for (let day = 1; day <= TOTAL_DAYS; day++) {
      expect(screen.getByText(`Tag ${day}`)).toBeInTheDocument();
    }
  });

  it("renders Tagesfragen and Alle bisherigen buttons for each day", () => {
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={mockOnGoMarked} progress={{}} />);
    const tagesButtons = screen.getAllByText("Tagesfragen");
    const alleButtons = screen.getAllByText("Alle bisherigen");
    expect(tagesButtons).toHaveLength(TOTAL_DAYS);
    expect(alleButtons).toHaveLength(TOTAL_DAYS);
  });

  it("calls onSelectDay with correct day and 'today' mode", async () => {
    const user = userEvent.setup();
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={mockOnGoMarked} progress={{}} />);
    const tagesButtons = screen.getAllByText("Tagesfragen");
    await user.click(tagesButtons[2]!);
    expect(mockOnSelectDay).toHaveBeenCalledWith(3, "today");
  });

  it("calls onSelectDay with correct day and 'cumulative' mode", async () => {
    const user = userEvent.setup();
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={mockOnGoMarked} progress={{}} />);
    const alleButtons = screen.getAllByText("Alle bisherigen");
    await user.click(alleButtons[0]!);
    expect(mockOnSelectDay).toHaveBeenCalledWith(1, "cumulative");
  });

  it("displays score badges when progress exists", () => {
    const progress = {
      1: { todayBest: 25, cumulativeBest: 30 },
    };
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={mockOnGoMarked} progress={progress} />);
    expect(screen.getByText("Tages: 25/33")).toBeInTheDocument();
    expect(screen.getByText("Alle: 30/33")).toBeInTheDocument();
  });

  it("does not display badges when no progress exists", () => {
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={mockOnGoMarked} progress={{}} />);
    expect(screen.queryByText(/Tages:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Alle:/)).not.toBeInTheDocument();
  });

  it("renders the author footer link", () => {
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={mockOnGoMarked} progress={{}} />);
    const link = screen.getByText("Jorge Ramírez");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "https://github.com/jorge-ramirez-purpose");
  });

  it("renders the Markierte Fragen button", () => {
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={mockOnGoMarked} progress={{}} />);
    expect(screen.getByText(/Markierte Fragen/)).toBeInTheDocument();
  });

  it("calls onGoMarked when clicking Markierte Fragen", async () => {
    const onGoMarked = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<DaySelectScreen onSelectDay={mockOnSelectDay} onGoMarked={onGoMarked} progress={{}} />);
    await user.click(screen.getByText(/Markierte Fragen/));
    expect(onGoMarked).toHaveBeenCalled();
  });
});
