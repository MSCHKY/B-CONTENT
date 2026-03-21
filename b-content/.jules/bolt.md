## 2024-05-23 - Concurrent DB Queries in Cloudflare D1
**Learning:** Sequential Cloudflare D1 queries block execution unnecessarily. D1 can execute independent queries in parallel via Promise.all(), drastically reducing overall response latency on analytical/stats endpoints that fetch unconnected data points.
**Action:** Always examine endpoints that do multiple DB queries and group independent ones into a single Promise.all() block.
