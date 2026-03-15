## 2025-03-08 - Prevent Global Re-renders on Form Input
**Learning:** Using `const { a, b } = useCreateStore()` destructured directly without a selector in Zustand causes the component to re-render whenever *any* state in the store changes. Because `useCreateStore` holds rapid-changing form state like `userInput` (updated on every keystroke), this caused all components connected to the store (e.g., `CreateFlow`, `ResultEditor`, etc.) to re-render constantly.
**Action:** Always use granular selectors `const a = useCreateStore(s => s.a)` or `useShallow` from `zustand/react/shallow` when accessing store properties to restrict re-renders to only when the specifically requested fields change.

## 2024-05-18 - Optimized Array Lookups Inside render Loops

**Learning:** When looping over an array inside a component's render method, lookups using `Array.prototype.filter()` or `Array.prototype.find()` can result in O(N*M) or O(N*D) complexity. This causes significant performance degradation.

**Action:** Replace `Array.prototype.filter()` and `Array.prototype.find()` lookups with pre-calculated `Map` or `Set` objects using `useMemo`. This transforms the complexity to O(N + M) or O(N + D), replacing expensive operations inside the render loop with an O(1) hash map/set lookup. Always memoize empty arrays returned from lookups as well to avoid new array references breaking shallow component comparisons.
