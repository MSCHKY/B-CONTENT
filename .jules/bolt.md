## 2024-03-28 - Parallelizing Batch Network Requests
**Learning:** Sequential `fetch` requests inside loops (`for...of`) create N+1 latency bottlenecks, compounding network delay for batch operations like saving multiple generated posts simultaneously.
**Action:** Always replace sequential network calls in loops with concurrent execution using `Promise.all()` to significantly reduce the total operation duration to roughly the duration of the longest single request.
