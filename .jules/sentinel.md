
## 2024-03-28 - [HIGH] Sanitize missing inputs to prevent XSS
**Vulnerability:** The PATCH `/api/posts/:id` endpoint lacked `sanitizeText` for the `text` and `hashtags` fields, whereas the POST `/api/posts` endpoint implemented them. This allowed potentially dangerous XSS payloads to bypass sanitization during post updates.
**Learning:** XSS vulnerabilities can be reintroduced if sanitization is not consistently applied across all mutation endpoints (POST, PUT, PATCH). Input validation and sanitization must mirror each other for create and update operations.
**Prevention:** Always verify that all paths mutating data, especially PATCH updates, apply the same sanitization functions used during creation.
