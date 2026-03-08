-- ============================================================
-- Migration 003: Recreate posts table with 'scheduled' status in CHECK constraint
-- SQLite does not support ALTER TABLE to modify CHECK constraints
-- Run: wrangler d1 execute b-content-db --remote --file=db/migration-003-status-check.sql
-- ============================================================

-- Step 1: Rename old table
ALTER TABLE posts RENAME TO posts_old;

-- Step 2: Create new table with updated CHECK constraint
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  instance TEXT NOT NULL CHECK(instance IN ('alex', 'ablas', 'bwg')),
  content_type TEXT NOT NULL,
  topic_fields TEXT NOT NULL DEFAULT '[]',
  text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK(language IN ('en', 'de')),
  hashtags TEXT NOT NULL DEFAULT '[]',
  char_count INTEGER NOT NULL DEFAULT 0,
  is_personal INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'review', 'approved', 'published', 'archived')),
  linked_posts TEXT DEFAULT NULL,
  image_id TEXT DEFAULT NULL,
  scheduled_at TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Step 3: Copy all data (explicit columns, coalesce null updated_at)
INSERT INTO posts (id, instance, content_type, topic_fields, text, language, hashtags, char_count, is_personal, status, linked_posts, image_id, scheduled_at, created_at, updated_at)
SELECT id, instance, content_type, topic_fields, text, language, hashtags, char_count, is_personal, status, linked_posts, image_id, scheduled_at, created_at, COALESCE(updated_at, created_at)
FROM posts_old;

-- Step 4: Drop old table
DROP TABLE posts_old;

-- Step 5: Recreate indices
CREATE INDEX IF NOT EXISTS idx_posts_instance ON posts(instance);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_is_personal ON posts(is_personal);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
