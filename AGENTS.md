# Repository Guidelines

## Project Structure & Module Organization
Application code resides in `backend/`. `server.js` boots Express and forwards to `app.js`, which wires middleware, view helpers, and routes. HTTP handlers live under `controllers/`, while `routes/` define URL mappings. Shared logic is grouped in `helpers/` and `services/`. Mongoose models are in `models/`, Handlebars layouts, views, and partials are in `views/`, and static assets (uploads, styles, scripts) live in `public/`. Integration fixtures and suites sit in `backend/tests/`, mirroring the features they exercise. Contributor-facing references, including the API curl playbook, are located in `backend/docs/api/`.

## Build, Test, and Development Commands
Run `yarn install` once to sync dependencies. Use `yarn dev` for hot-reload development via Nodemon, or `yarn start` to boot the production Express server. Execute `yarn test` to run the Jest and Supertest suites; the command provisions an in-memory Mongo instance, so no manual database setup is required.

## Coding Style & Naming Conventions
Use two-space indentation, double quotes, and trailing commas where allowed. Favor `const` for imports and immutable references. Keep import order as: core packages, third-party packages, local modules. Use `camelCase` for variables and functions, `PascalCase` for Mongoose models (e.g., `Image`, `PostComment`). Handlebars partials remain snake_case (`views/partials/sidebar.hbs`). No automatic formatter is bundled; rely on ESLint defaults and review diffs before committing.

## Testing Guidelines
All suites belong in `backend/tests/` and must end with `.test.js`. Prefer Supertest for route verification, asserting status codes, payload shape, and rendered content where applicable. Stub external work (e.g., filesystem) to keep runs deterministic. Before pushing, run `yarn test`; include additional assertions for bug fixes to avoid regressions.

## Commit & Pull Request Guidelines
Commits should be concise, present-tense, and scoped to one concern. Use the established prefixes (`feat:`, `fix:`, `update:`, `improve:`, `enhance:`) and keep subject lines under 72 characters. Pull requests must summarize changes, list manual or automated tests, and attach screenshots if UI behavior shifts. Reference related issues and ensure the branch is rebased on `master` prior to review.

## Security & Configuration Tips
Copy `.env.example` to `.env` and provide `MONGO_URI` when not using the local fallback. Never commit real secrets; encrypted values belong in `.env.enc` if you maintain one. Helmet is preconfigured—verify additional middleware preserves the default security headers. Clean up uploaded temp files in new flows and document any third-party dependency you introduce.
