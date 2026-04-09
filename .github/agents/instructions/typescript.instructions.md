---
applyTo: '**/*.ts,**/*.tsx'
---

# TypeScript Conventions

## Types

This document contains concise TypeScript conventions and best practices for this repository. Apply these rules in PR reviews, new code, and when updating configs.

### Core compiler settings
- Enable `strict` mode and related flags in `tsconfig.json` (`noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`).
- Use `isolatedModules` for single-file transpilers compatibility.
- Prefer type-only imports/exports (`import type`, `export type`) when the imported symbol is only used for typing.

### Types & design
- Prefer `unknown` over `any`. Narrow `unknown` before use.
- Avoid `any`; if temporarily necessary, add a `// TODO` and create a follow-up issue.
- Use `readonly` for arrays and object properties where mutation is not intended.
- Prefer `interface` for exported, public APIs; use `type` for unions, mapped types, or utility composition.
- Use discriminated unions for variant-rich data shapes to get exhaustive checks.
- Parse and validate external input at module boundaries and convert to well-typed domain models early.

### Code style & lint
- Enforce rules via ESLint with `@typescript-eslint` and Prettier for formatting.
- Key enforced rules: `no-explicit-any` (warn or error as configured), `consistent-type-imports`, `no-floating-promises`, `strict-boolean-expressions`.
- Run `npm run lint` and `npm run format` in pre-commit hooks (see repo `package.json`).

### Project conventions
- Use the `@` path alias (configured in `tsconfig.json`/`vite.config.ts`) for imports from `src`.
- Prefer named exports for utilities and components.
- Keep modules focused: one responsibility per file.

### React specifics
- Explicitly type component props with an interface: `function MyComp(props: MyProps) {}`.
- Avoid `React.FC` for most public components to prevent implicit `children` unless desired.
- Use `useCallback`/`useMemo` only when there is a measurable benefit.

### Generics & utilities
- Keep generic APIs minimal and provide sensible defaults only when helpful.
- Use built-in utility types (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`) to reduce boilerplate.

### Nullability & error handling
- Prefer explicit non-nullable types where possible; use `Result`/`Either` patterns for fallible operations when appropriate.
- Do not swallow parse/validation errors silently.

### Async & promises
- Prefer `async/await` consistently.
- Ensure promises are awaited or explicitly handled; use lint rules to catch unawaited promises.

### Testing & types
- Add type-level tests for critical type contracts (use `tsd` or similar where needed).

### Documentation & enforcement
- Document public APIs with short JSDoc comments.
- Add `husky` + `lint-staged` to run lint/format on staged files and fail CI on type or lint errors.
- Recommend editor extensions: TypeScript, ESLint, Prettier for VS Code contributors.

### Quick adoption steps
1. Turn on `strict` in `tsconfig.json`.
2. Add or enforce ESLint + `@typescript-eslint` rules listed above.
3. Add `husky` + `lint-staged` to run `npm run lint` and `npm run format` on commit.
4. Add `npm run lint` and `npm run build` to CI checks.

If you want, I can also create a standalone markdown guide file and example `husky` + `lint-staged` configuration in the repo.

