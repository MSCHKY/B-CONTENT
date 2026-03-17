## 2026-03-17 - Optimize Calendar Array Scans
**Learning:** O(N) array methods (.filter, .some) inside render loops like calendar grids cause O(N*M) performance bottlenecks and break shallow comparisons by generating new array references on every render.
**Action:** Always pre-calculate Sets and Maps with useMemo for O(1) lookups, and memoize fallback empty arrays (e.g., const EMPTY_ARR = useMemo(() => [], [])) to preserve reference equality.
