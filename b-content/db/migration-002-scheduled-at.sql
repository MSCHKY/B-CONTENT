-- ============================================================
-- Migration 002: Add scheduled_at to posts
-- Run: wrangler d1 execute b-content-db --remote --file=db/migration-002-scheduled-at.sql
-- ============================================================

ALTER TABLE posts ADD COLUMN scheduled_at TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
