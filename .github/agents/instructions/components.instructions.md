---
applyTo: 'src/components/**,src/pages/**'
---

# Component Creation Instructions

Purpose
- Provide a clear, consistent process for adding new React + TypeScript components to this project.

Where to add
- Put reusable, presentational components under `src/components/` grouped by purpose (e.g., `ui/`, `layout/`, `forms/`, `charts/`).
- Put route-level or page-specific components under `src/pages/<Feature>/components/` or the feature's folder in `controller/features/<feature>/components/` when business logic is involved.

Folder & file pattern
- Use a folder per component when it contains multiple files:
	- `MyComponent/`
		- `MyComponent.tsx` — main component
		- `MyComponent.styles.ts` — Emotion/MUI styled helpers (optional)
		- `MyComponent.test.tsx` — unit tests
		- `MyComponent.types.ts` — local types (optional)
		- `index.ts` — re-export: `export {default} from './MyComponent'`
- For tiny, single-file presentational components you may use `MyComponent.tsx` directly in the parent folder.

Naming
- PascalCase for component folders and filenames: `MyButton`, `StatCard`.
- Props type: `MyComponentProps` in the same file or `MyComponent.types.ts` for larger definitions.

TypeScript & typing
- Avoid `any`. Use precise types and prefer `interface` for exported prop shapes.
- Do not use `React.FC`; declare as `function MyComponent(props: MyComponentProps) { ... }`.

Styling
- Use MUI + Emotion theming utilities. Prefer `sx` for small adjustments and `styled()` / `emotion` files for complex styles.
- Keep styles co-located in `MyComponent.styles.ts` when they are component-specific.

Separation of concerns
- Presentational UI components: no data fetching, minimal logic, receive everything via props.
- Stateful or data-fetching logic: place in `controller/features/<feature>/hooks` or in a dedicated hook under `src/hooks/` and pass results to presentational components.

Imports & aliases
- Use the `@/` alias for intra-repo imports (e.g., `import { formatDate } from '@/helpers/dates'`). Do NOT use deep relative `../../../` paths for code inside `src`.

i18n & accessibility
- Use `useTranslation()` for user-facing text (i18n) when the component displays translatable strings.
- Add accessible attributes: `aria-label`, `role`, keyboard handlers, and semantic HTML. Images need `alt` text.

Testing
- Add unit tests with `React Testing Library` under the component folder. Tests should assert behaviour not snapshots.
- Name tests `MyComponent.test.tsx` and aim for small, focused tests.

Documentation
- Add concise JSDoc comments for non-obvious props and any public utility functions.

Exports & barrel files
- Add an `index.ts` re-export in component folders to make imports cleaner: `export { default } from './MyComponent'`.

PR checklist for new components
- Files follow folder pattern and naming conventions.
- No `any` types and `MyComponentProps` present.
- Uses `@/` alias for internal imports.
- Accessibility attributes added where applicable.
- Unit tests included and passing locally.

Examples
- Presentational component: `src/components/ui/StatCard/StatCard.tsx` (no data fetching, receives props).
- Feature-aware component: `controller/features/utilities/components/UtilityList/UtilityList.tsx` (uses hooks from `controller/features/utilities/hooks`).

When to ask for review
- Ask for a code review when the component touches shared UI patterns, introduces new public props, or affects accessibility.

If uncertain
- Ask a short targeted question (e.g., "Should this component be reusable across features or scoped to one feature?").

