## 2024-05-24 - XSS Bypass in Regex Sanitizer
**Vulnerability:** The `sanitizeText` function used a complex regex to strip specific HTML tags (`<script>`, `<iframe>`) and quoted `on*=` event handlers, but failed to catch unquoted attributes (`<img src=x onerror=alert(1)>`), backtick attributes, and malformed tags, leaving the app vulnerable to XSS when rendering user input.
**Learning:** Blacklisting specific HTML tags and attributes using regular expressions is extremely difficult to get right and is frequently bypassed by edge cases and novel payloads.
**Prevention:** Use established sanitization libraries (like DOMPurify) or, when plain text is expected, safely strip all HTML structure (e.g., stripping `<` and `>` characters) rather than trying to filter out "bad" parts.
