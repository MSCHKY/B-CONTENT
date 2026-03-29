## 2026-03-29 - Fix Auth Bypass and PII Leakage
**Vulnerability:** The auth middleware bypassed authentication for all non-production environments (e.g. preview, staging), allowing unauthenticated mutating API access. It also logged plaintext email addresses, leaking PII.
**Learning:** The check env !== 'production' is insecure as it defaults to trusting unknown environments. Authentication should be opt-out, not opt-in. Logging raw headers without redaction exposes user data in plain text.
**Prevention:** Default to enforcing authentication. Use exact environment match (e.g., env === 'development') for bypasses. Always redact PII from logs.
