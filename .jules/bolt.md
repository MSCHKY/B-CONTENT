## 2025-03-08 - Prevent Global Re-renders on Form Input
**Learning:** Using `const { a, b } = useCreateStore()` destructured directly without a selector in Zustand causes the component to re-render whenever *any* state in the store changes. Because `useCreateStore` holds rapid-changing form state like `userInput` (updated on every keystroke), this caused all components connected to the store (e.g., `CreateFlow`, `ResultEditor`, etc.) to re-render constantly.
**Action:** Always use granular selectors `const a = useCreateStore(s => s.a)` or `useShallow` from `zustand/react/shallow` when accessing store properties to restrict re-renders to only when the specifically requested fields change.

## 2025-03-09 - Avoid Array filtering inside React map loops
**Learning:** Using `Array.filter()` or `Array.some()` inside a `.map()` loop during rendering (like iterating over 30-40 calendar days and filtering an array of scheduled posts for each day) creates an $O(N \times M)$ operation that severely degrades rendering performance as data grows.
**Action:** Always pre-calculate lookups using `Map` (for finding/filtering items) and `Set` (for boolean checks) wrapped in `useMemo` before the `.map()` loop. This reduces the time complexity to $O(N + M)$ and guarantees $O(1)$ lookups per iteration.
