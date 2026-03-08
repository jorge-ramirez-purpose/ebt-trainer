# Einbuergerungstest Trainer

A web-based study tool for preparing for the German Einbuergerungstest (citizenship test). It covers all 310 official questions, organized into a structured 10-day study plan with progress tracking.

## Features

- **310 official questions** extracted from the Einbuergerungstest PDF, with verified correct answers
- **10-day study plan** — 33 questions per day (Day 10 has 13), providing a structured path through the full question catalog
- **Two exam modes per day**:
  - **Tagesfragen** — quiz only that day's assigned questions
  - **Alle bisherigen** — quiz 33 random questions drawn from all questions learned up to and including that day
- **Randomized question and option order** — both the question sequence and the answer options (A/B/C/D) are shuffled on every attempt, preventing memorization by position
- **Instant feedback** — after confirming an answer, see whether it was correct or wrong, with the correct answer highlighted
- **Results screen** — displays score, pass/fail status (17/33 to pass), and a list of incorrectly answered questions with their correct answers
- **Review mode** — after a quiz, review only the questions you got wrong, re-answering them with shuffled options
- **Progress persistence** — best scores per day and mode are saved to `localStorage` and displayed as badges on the home screen
- **Fully responsive** — dark-themed UI optimized for both desktop and mobile

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.7 | Type safety |
| Vite | 6 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling |

No routing library, state management library, or backend required. All state is managed with React's `useState` and persisted in `localStorage`.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Output goes to `dist/`. Preview locally with:

```bash
npm run preview
```

## Project Structure

```
src/
  App.tsx                        # Root component — screen routing and quiz state management
  main.tsx                       # React entry point
  components/
    DaySelectScreen.tsx          # Home screen — 10 day cards with exam mode buttons and score badges
    QuizScreen.tsx               # Quiz UI — question display, option buttons, progress bar, feedback
    ResultsScreen.tsx            # Results — score, pass/fail, list of wrong answers
    ReviewScreen.tsx             # Review — re-answer only the questions you got wrong
    OptionButton.tsx             # Reusable answer option button with state-based styling
  constants/
    labels.ts                   # App-wide constants (LABELS, PASSING_SCORE, QUESTIONS_PER_DAY, etc.)
  data/
    questions.ts                # All 310 questions with options and correct answer index
  types/
    question.ts                 # All type definitions (TQuestion, TResult, TScreen, TExamMode, etc.)
  utils/
    dayHelpers.ts               # Day-based question selection, quiz set building, option shuffling
    getOptionState.ts           # Determines visual state of an option button (default/selected/correct/wrong)
    shuffle.ts                  # Generic Fisher-Yates shuffle
    storage.ts                  # localStorage read/write for progress tracking
```

## How It Works

### Study Plan

The 310 questions are divided into 10 days:

| Day | Questions | Count |
|---|---|---|
| 1 | 1 -- 33 | 33 |
| 2 | 34 -- 66 | 33 |
| 3 | 67 -- 99 | 33 |
| 4 | 100 -- 132 | 33 |
| 5 | 133 -- 165 | 33 |
| 6 | 166 -- 198 | 33 |
| 7 | 199 -- 231 | 33 |
| 8 | 232 -- 264 | 33 |
| 9 | 265 -- 297 | 33 |
| 10 | 298 -- 310 | 13 |

### Exam Modes

Each day offers two buttons:

- **Tagesfragen**: quizzes all questions assigned to that specific day, in random order
- **Alle bisherigen**: picks 33 random questions from the cumulative pool (Day 1 = Q1-33, Day 5 = Q1-165, Day 10 = Q1-310)

### Scoring and Progress

- A quiz is considered passed with **17 or more correct answers** out of 33 (mirroring the real test's ~50% threshold)
- After completing a quiz, the score is saved to `localStorage` under the key `ebt-progress`
- Only the **best score** per day/mode combination is stored — lower scores don't overwrite a previous best
- The home screen displays score badges per day: green for Tagesfragen, blue for Alle bisherigen

### Screen Flow

```
Home (DaySelectScreen)
  |
  +--> Quiz (QuizScreen) -- answer questions one by one
         |
         +--> Results (ResultsScreen) -- see score and wrong answers
                |
                +--> Review (ReviewScreen) -- re-answer wrong questions
                |
                +--> Retry -- restart the same quiz
                |
                +--> Home -- return to day selection
```

Every screen has a back button to return to the home screen.

### Option Randomization

Both the question order and the answer options within each question are shuffled using a Fisher-Yates algorithm. The correct answer index is remapped after shuffling so feedback remains accurate. This applies to both quiz mode and review mode.

## Code Conventions

- **Types over interfaces** — all type definitions use `type`, never `interface`
- **T-prefix** — all types start with `T` (e.g. `TQuestion`, `TResult`, `TDayProgress`). Component prop types are always named `TProps`
- **Arrow functions only** — no `function` declarations anywhere
- **Descriptive variable names** — no single-letter variables; always human-readable names
- **Constants folder** — universal constants live in `src/constants/`
- **Types folder** — all shared type definitions live in `src/types/`

## Data Source

The 310 questions were extracted from the official Einbuergerungstest PDF (`src/assets/einburgerungstest.pdf`). Correct answers were determined by parsing the green-colored text (RGB: 0.031, 0.667, 0.118) in the PDF's content streams.

## Author

[Jorge Ramirez](https://github.com/jorge-ramirez-purpose)
