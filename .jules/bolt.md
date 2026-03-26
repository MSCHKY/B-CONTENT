## 2025-03-08 - Prevent Global Re-renders on Form Input
**Learning:** Using `const { a, b } = useCreateStore()` destructured directly without a selector in Zustand causes the component to re-render whenever *any* state in the store changes. Because `useCreateStore` holds rapid-changing form state like `userInput` (updated on every keystroke), this caused all components connected to the store (e.g., `CreateFlow`, `ResultEditor`, etc.) to re-render constantly.
**Action:** Always use granular selectors `const a = useCreateStore(s => s.a)` or `useShallow` from `zustand/react/shallow` when accessing store properties to restrict re-renders to only when the specifically requested fields change.

## 2025-03-08 - Optimize O(N*M) Calendar Rendering
**Learning:** Found an O(N*M) anti-pattern in the calendar grid. For each of the ~40 calendar days rendered, the code called `Array.filter()` on `scheduled` and `Array.some()` on `conflicts`. This meant looping over all posts/conflicts every single day during render, causing excessive calculations especially during Drag and Drop operations.
**Action:** Replaced loop lookups with pre-calculated `Map` for posts and `Set` for conflicts using `useMemo`. Memoized empty arrays (`EMPTY_ARR`) for fallbacks to preserve shallow component equality.
