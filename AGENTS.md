# Repository Guidelines

## Project Structure & Module Organization
The application lives under `backend/`, with `server.js` bootstrapping Express and delegating to `app.js`. HTTP logic is split across `routes/` definitions and `controllers/` actions, while shared domain logic sits in `services/` and `helpers/`. Mongoose schemas reside in `models/`, Handlebars templates and partials are under `views/`, and static assets (images, scripts, styles) belong in `public/`. Jest integration tests live in `tests/`, mirroring the route they exercise.

## Build, Test, and Development Commands
Run `yarn install` once to sync dependencies. Create environment files with `cp .env.example .env` and populate `MONGO_URI` when not using the local fallback. Use `yarn dev` for a hot-reloading server via Nodemon, or `yarn start` for the production entry path. Execute `yarn test` to launch Jest in headless mode; set `NODE_ENV=test` to bypass Mongo connections during suites.

## Coding Style & Naming Conventions
Follow the existing two-space indentation and `const`-first pattern seen in `backend/app.js`. Use `camelCase` for variables and functions, and `PascalCase` for Mongoose models (e.g., `Image`, `User`). Place shared helpers in `helpers/` and export them with descriptive names. Template files should keep snake-cased Handlebars partials (e.g., `views/partials/image_card.hbs`) for clarity. No formatter is bundled, so verify linting manually before opening a PR.

## Testing Guidelines
Author route and controller tests beside their targets under `backend/tests/` with filenames ending in `.test.js`. Prefer Supertest for HTTP assertions and Jest snapshots only when rendering output stabilizes. Each test suite should stub external services and assert status codes, payload shape, and handlebars content. Capture regression cases before fixing bugs and ensure suites pass locally with `yarn test`.

## Commit & Pull Request Guidelines
Write concise, present-tense commits (`refactor data handling and add validation`, `feat: translate to zhtw`) and keep them scoped to a single concern. Reference related issues in the body when applicable. Pull requests should summarize changes, list manual or automated test results, and include screenshots for UI adjustments. Confirm `.env` secrets stay local and request review once branches are rebased on the latest `main`.

## Environment & Security Tips
Use `.env` for tokens and database credentials and never commit the file -- `.env.example` documents required keys. Helmet is preconfigured; ensure new middleware preserves security headers. When adding third-party packages, record why in the PR description and update dependency scanning if necessary.
