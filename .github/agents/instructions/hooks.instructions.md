---
applyTo: 'src/hooks/**'
---

# Hook Creation Instructions

Purpose
- Define clear, consistent conventions for creating React hooks in this project so they are predictable, testable, and reusable.

Where to add
- Shared hooks: `src/hooks/` (e.g., `useAuth`, `useFetch`, `useToggle`).
- Feature-scoped hooks: `controller/features/<feature>/hooks/` when hooks are tightly coupled to a single feature's domain logic.

Folder & file pattern
- Use a single file per hook for simple hooks: `useMyHook.ts`.
- For complex hooks with helpers or types, use a folder:
	- `useMyHook/`
		- `index.ts` — re-export the hook
		- `useMyHook.ts` — implementation
		- `useMyHook.types.ts` — local types (optional)
		- `useMyHook.test.ts` — tests

Naming
- Hook filenames and exported functions must start with `use` and use camelCase: `useDashboardData`, `useToggle`.

API & typing
- Export a single typed function: `export function useMyHook(args: ArgsType): ReturnType { ... }`.
- Use explicit return types for exported hooks. Avoid `any` in input and return types.
- Prefer `interface` for complex shapes and export shared types from `src/types/` when used across features.

Side effects & lifecycles
- Use `useEffect` for side effects and always provide cleanup where applicable.
- Keep dependency arrays accurate and minimal; prefer stable callbacks (`useCallback`) or memoized values (`useMemo`) over disabling the lint rule.

> Important: Never call hooks conditionally or inside loops — follow React Rules of Hooks strictly.

Separation of concerns
- Hooks should encapsulate stateful logic and side effects only. Do NOT perform rendering or DOM manipulation (except through refs) inside hooks.
- Data fetching hooks should return loading/error states and raw data; parsing/formatting can be delegated to small pure helper functions.

Asynchronous logic
- Always handle cancellation when using async operations in effects (e.g., `let mounted = true` or `AbortController`).
- Surface errors through the returned shape rather than throwing in the hook unless the hook consumer expects exceptions.

Performance considerations
- Keep hooks small and focused. If a hook grows large, split responsibilities into smaller hooks.
- Memoize values and callbacks exported by the hook if consumers will rely on stable references.

Testing
- Write unit tests for hooks using `@testing-library/react-hooks` or the appropriate utilities. Test both success and error paths and cleanup behaviour.
- Name tests `useMyHook.test.ts` and place them next to the hook file.

Usage patterns
- Presentation components should consume hooks in their parent containers and receive data/handlers via props.
- Avoid using hooks to perform imperative navigation or global side-effects except when clearly documented (e.g., `useAuth` may call `navigate()` after sign-out if documented).

Imports & aliases
- Use the `@/` alias for intra-repo imports inside hooks (e.g., `import { api } from '@/controller/features/utilities/api'`).

Docs & changelog
- Add a short comment header describing the hook's purpose, inputs, and outputs for non-obvious hooks.

PR checklist for new hooks
- Hook name starts with `use` and file structure follows the pattern.
- Exported hook has explicit TypeScript types and no `any` usage.
- Effects have appropriate cleanup and dependency arrays.
- Async logic includes cancellation or safe guards.
- Tests included and passing locally.

If uncertain
- Ask a concise question (e.g., "Should this hook be shared across features or scoped to `controller/features/<feature>`?").

