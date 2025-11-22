This file provides guidelines for AI assistants working in this repo.

- Scope: These instructions apply to the entire repository.
- Style: Follow existing patterns in the codebase; keep changes minimal and focused on the task.
- TypeScript/React: Prefer TypeScript types over `any`, and keep components small and composable.
- Next.js: Respect the current routing/app structure; don’t introduce new patterns unless requested.
- Tests: If tests exist for modified areas, update them as needed but don’t introduce new test frameworks.
- Tooling: Don’t modify tooling (lint, formatting, build) unless explicitly asked.
- Comments: Avoid adding comments unless they clarify non-obvious logic.
- Git commits: When committing, use conventional prefixes like `feat:`, `fix:`, `docs:`, `chore:`, etc. for commit messages.

If anything in this file conflicts with direct user instructions, follow the user.
