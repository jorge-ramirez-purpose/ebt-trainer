# Backend Guide — Phase 1: REST API for Questions

This guide walks you through setting up a Node.js backend for the EBT Trainer app. By the end, you'll have a REST API serving the 310 German citizenship test questions from PostgreSQL, with the React frontend fetching from the API (and falling back to static data if the server is down).

## Prerequisites

- **Node.js** >= 18
- **pnpm** (already used by the project)
- **PostgreSQL** running locally (e.g. via Homebrew: `brew install postgresql@16 && brew services start postgresql@16`)
- **A database** created for the project:
  ```bash
  createdb ebt_trainer
  ```

---

## Step 1: Explore the New Project Structure

The backend lives inside `server/` at the project root:

```
server/
├── package.json              # Backend dependencies & scripts
├── tsconfig.json             # TypeScript config for the server
├── .env                      # Environment variables (gitignored)
├── .env.example              # Template for .env
├── prisma/
│   ├── schema.prisma         # Database schema (Question model)
│   └── seed.ts               # Seeds DB with the 310 questions
└── src/
    ├── index.ts              # Entry point — starts the server
    ├── app.ts                # Express app factory
    ├── config.ts             # Loads env vars
    ├── middleware/
    │   ├── errorHandler.ts   # Centralized error handling
    │   └── validateRequest.ts # Zod-based request body validation
    ├── routes/
    │   └── questionRoutes.ts # REST endpoints for /api/questions
    ├── services/
    │   └── questionService.ts # Prisma queries + data mapping
    ├── types/
    │   └── question.ts       # Server-side TQuestion type
    └── __tests__/
        └── questions.test.ts # API integration tests
```

The frontend also has two changes:
- **`src/api/questionsApi.ts`** — fetch wrapper with static fallback
- **Modified routes/components** — fetch questions from API instead of importing the static file

---

## Step 2: Install Dependencies

```bash
# Install root dev dependency (concurrently — runs frontend + backend together)
pnpm install

# Install backend dependencies
cd server
pnpm install
cd ..
```

---

## Step 3: Set Up the Database

### 3.1 Configure environment variables

Edit `server/.env` and update the `DATABASE_URL` if your PostgreSQL setup differs from the default:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ebt_trainer?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:5173"
```

### 3.2 Understand the Prisma schema

Open `server/prisma/schema.prisma`. The `Question` model has:
- **`id`** — `Int @id` (NOT auto-increment, since questions have stable IDs 1–310)
- **`optionA` through `optionD`** — four separate columns instead of a JSON array (more relational, more queryable)
- **`answer`** — `Int` (0–3, matching the option index)
- **`createdAt` / `updatedAt`** — timestamps

### 3.3 Run the migration

This creates the `Question` table in PostgreSQL:

```bash
cd server
npx prisma migrate dev --name init
```

You should see output confirming the migration was applied.

### 3.4 Seed the database

The seed script imports all 310 questions from the frontend's static file and inserts them into PostgreSQL:

```bash
npx prisma db seed
```

You should see: `Seeded 310 questions.`

### 3.5 Verify with Prisma Studio (optional)

```bash
npx prisma studio
```

This opens a browser UI where you can browse the Question table and see all 310 rows.

---

## Step 4: Understand the Server Code

### 4.1 Config (`server/src/config.ts`)

Loads environment variables using `dotenv/config`. Provides typed config with defaults:
- `PORT` defaults to 3001
- `CORS_ORIGIN` defaults to `http://localhost:5173` (Vite's dev server)

### 4.2 App Factory (`server/src/app.ts`)

Creates an Express app with:
1. **CORS** — allows the frontend origin
2. **JSON parsing** — `express.json()`
3. **Routes** — mounts `/api/questions`
4. **Error handler** — catches and formats errors

The factory pattern (`createApp()`) makes the app testable — tests can import it without starting the server.

### 4.3 Question Service (`server/src/services/questionService.ts`)

The service layer handles all database operations through Prisma:

- **`toTQuestion(row)`** — converts a DB row (with `optionA`–`optionD`) back to the frontend's format (with `options` array)
- **`fromTQuestion(data)`** — splits the `options` array into separate columns for storage
- **`getAllQuestions(day?)`** — returns all questions, or filters by day using ID ranges
- **`getQuestionById(id)`** — returns one question or null
- **`createQuestion(data)`** — auto-assigns the next ID
- **`updateQuestion(id, data)`** — returns null if not found
- **`deleteQuestion(id)`** — returns false if not found

### 4.4 Routes (`server/src/routes/questionRoutes.ts`)

Five REST endpoints:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/questions` | All questions (optional `?day=N` filter) |
| GET | `/api/questions/:id` | Single question by ID |
| POST | `/api/questions` | Create a new question (Zod-validated) |
| PUT | `/api/questions/:id` | Update a question (Zod-validated) |
| DELETE | `/api/questions/:id` | Delete a question (returns 204) |

All responses use the shape `{ data: ... }` for consistency.

### 4.5 Middleware

**`errorHandler.ts`** — catches three error types:
- `ZodError` → 400 with validation details
- Prisma "not found" (`P2025`) → 404
- Everything else → 500

**`validateRequest.ts`** — a reusable middleware that validates `request.body` against a Zod schema. If validation fails, the error is passed to `next()` (and caught by the error handler).

---

## Step 5: Start the Servers

### Option A: Run both together

```bash
pnpm dev
```

This uses `concurrently` to start both the Vite dev server (port 5173) and the Express server (port 3001).

### Option B: Run separately

```bash
# Terminal 1 — frontend
pnpm dev:fe

# Terminal 2 — backend
pnpm dev:be
```

---

## Step 6: Test the API

### 6.1 Manual testing with curl

```bash
# Get all questions (should return 310)
curl http://localhost:3001/api/questions | jq '.data | length'

# Get questions for day 1 (should return 33)
curl http://localhost:3001/api/questions?day=1 | jq '.data | length'

# Get a single question
curl http://localhost:3001/api/questions/1 | jq '.data'

# Create a new question
curl -X POST http://localhost:3001/api/questions \
  -H "Content-Type: application/json" \
  -d '{"question":"Test?","options":["A","B","C","D"],"answer":0}' | jq

# Update a question
curl -X PUT http://localhost:3001/api/questions/1 \
  -H "Content-Type: application/json" \
  -d '{"question":"Updated?","options":["A","B","C","D"],"answer":1}' | jq

# Delete a question
curl -X DELETE http://localhost:3001/api/questions/311 -w "\n%{http_code}\n"
```

### 6.2 Automated tests

The API tests live in `server/src/__tests__/questions.test.ts` and use Supertest:

```bash
cd server
pnpm test
```

> **Note**: These tests hit the real database. Make sure PostgreSQL is running and the database is seeded.

### 6.3 Frontend tests

```bash
# From the project root
pnpm test
```

All frontend tests pass — the refactored `dayHelpers` functions now accept a `questions` array parameter, and the tests import the static data to pass in.

---

## Step 7: Understand the Frontend Changes

### 7.1 API Layer (`src/api/questionsApi.ts`)

Two functions:
- **`fetchAllQuestions()`** — fetches from `/api/questions`, falls back to static import on error
- **`fetchQuestionsForDay(day)`** — fetches from `/api/questions?day=N`, falls back to static slice

The static fallback means the app still works without the backend running.

### 7.2 Refactored `dayHelpers.ts`

The static `import { questions }` was removed. Three functions now accept a `questions` parameter:
- `getQuestionsForDay(day, questions)`
- `getCumulativeQuestions(day, questions)`
- `buildQuizSet(day, mode, questions)`

`getDayQuestionRange(day)` uses the `TOTAL_QUESTIONS` constant instead, since it only needs the total count.

### 7.3 Updated Routes

**`QuizRoute.tsx`**:
- Fetches all questions on mount via `fetchAllQuestions()`
- Shows "Laden..." while loading
- Passes fetched array to `buildQuizSet()`, review filtering, and `ResultsScreen`

**`StudyRoute.tsx`**:
- Fetches day-specific questions via `fetchQuestionsForDay(day)`
- Shows "Laden..." while loading

### 7.4 Updated `ResultsScreen.tsx`

- Removed static `import { questions }`
- Added `questions: TQuestion[]` to `TProps`
- Uses the prop for wrong-answer lookup

### 7.5 Vite Proxy (`vite.config.ts`)

```ts
server: {
  proxy: {
    "/api": "http://localhost:3001",
  },
},
```

In development, the Vite dev server proxies any `/api/*` request to the Express backend. This avoids CORS issues and lets the frontend use relative URLs.

---

## Step 8: Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `pnpm dev` | `concurrently "vite" "pnpm --filter ./server dev"` | Start both servers |
| `pnpm dev:fe` | `vite` | Start frontend only |
| `pnpm dev:be` | `pnpm --filter ./server dev` | Start backend only |
| `pnpm test` | `vitest run` | Run frontend tests |
| `pnpm test:e2e` | `playwright test` | Run E2E tests (starts both servers) |
| `pnpm db:migrate` | `prisma migrate dev` (in server) | Run database migrations |
| `pnpm db:seed` | `prisma db seed` (in server) | Seed the database |

---

## Troubleshooting

**"Connection refused" on port 5432**
→ PostgreSQL isn't running. Start it: `brew services start postgresql@16`

**"Database does not exist"**
→ Create it: `createdb ebt_trainer`

**Frontend shows "Laden..." forever**
→ The API might be down. Check the backend terminal for errors. The app should fall back to static data after the fetch fails — check the browser console for the fallback warning.

**"Cannot find module '@prisma/client'"**
→ Run `cd server && npx prisma generate` to generate the Prisma client.

---

## Future Phases

- **Phase 2: User Auth** — JWT-based registration/login, auth middleware
- **Phase 3: Progress API** — Store scores in PostgreSQL instead of localStorage
- **Phase 4: WebSocket Sync** — Real-time progress sync across tabs/devices via socket.io
- **Phase 5: External APIs** — Translation API, AI answer explanations, Redis caching
