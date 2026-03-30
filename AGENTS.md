# Repository Guidelines

## Project Structure & Module Organization
This is a TanStack Start + Vite + TypeScript app. Main application code lives in `src/`.

- `src/routes/`: file-based route modules, including authenticated dashboard flows.
- `src/routes/-components/`: route-scoped UI such as `transaction-form.tsx`.
- `src/components/ui/`: reusable UI primitives.
- `src/db/`: Drizzle schema, queries, DB client setup, and `seed.ts`.
- `src/lib/`: shared utilities.
- `src/routeTree.gen.ts`: generated router output; do not edit by hand.
- `drizzle/`: generated migration output from Drizzle Kit.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the local Vite dev server on port `3000`.
- `npm run build`: create a production build.
- `npx drizzle-kit generate`: generate migrations from `src/db/schema.ts`.
- `npx tsx src/db/seed.ts`: seed category data; requires `DATABASE_URL` in `.env`.

There is no dedicated `test`, `lint`, or `format` script yet. If you add one, document it here and keep it runnable from `package.json`.

## Coding Style & Naming Conventions
Follow the existing TypeScript/React style in `src/`: functional components, named exports where practical, and path aliases via `@/*`.

- Use 2-space indentation in config files and preserve the surrounding file style in source files.
- Use `PascalCase` for React components, `camelCase` for variables/functions, and kebab-case filenames for route-scoped components such as `transaction-form.tsx`.
- Keep route files aligned with TanStack’s file-routing naming patterns, including `_authed` and nested layout markers.

## Testing Guidelines
Automated tests are not configured yet. Until they are, verify changes with `npm run build` and manual browser checks through `npm run dev`, especially for route transitions, auth-protected pages, and transaction flows.

When adding tests, colocate them near the feature (`*.test.ts[x]`) or in a top-level `tests/` directory and prefer covering DB queries and form validation paths first.

## Commit & Pull Request Guidelines
Recent history mixes plain summaries and Conventional Commit prefixes. Prefer short, imperative subjects such as `feat: add transaction filter` or `fix: validate category selection`.

PRs should include:
- a clear summary of user-visible changes,
- linked issue or task context,
- screenshots for UI changes,
- notes about schema, environment, or seed-data changes.

## Security & Configuration Tips
Secrets belong in `.env`, not in source control. `DATABASE_URL` is required for Drizzle and seed scripts, and Clerk-related changes should be reviewed carefully because auth middleware is initialized in `src/start.ts`.
