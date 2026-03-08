# Project Rules

## Code Style

- Always use `type` instead of `interface` for type definitions
- Always use arrow functions (no `function` declarations)
- Place type definitions in `src/types/` folder
- Place universal constants in `src/constants/` folder
- All type names must start with `T` prefix (e.g. `TQuestion`, `TResult`, `TDayProgress`)
- Component prop types should be named `TProps` (local to each component file)
- No single-letter variable names — use descriptive, human-readable names (e.g. `question` not `q`, `result` not `r`, `optionIndex` not `i`)
