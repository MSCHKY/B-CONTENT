-- ============================================================
-- Migration: Add 'archived' to posts status CHECK constraint
-- 
-- D1 does NOT support ALTER TABLE ... ALTER COLUMN for CHECK constraints.
-- We must recreate the table with the updated constraint.
-- ============================================================

-- Step 1: Create new table with updated CHECK constraint
CREATE TABLE posts_new (
  id TEXT PRIMARY KEY,
  instance TEXT NOT NULL CHECK(instance IN ('alex', 'ablas', 'bwg')),
  content_type TEXT NOT NULL,
  topic_fields TEXT NOT NULL DEFAULT '[]',
  text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK(language IN ('en', 'de')),
  hashtags TEXT NOT NULL DEFAULT '[]',
  char_count INTEGER NOT NULL DEFAULT 0,
  is_personal INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'review', 'approved', 'published', 'archived')),
  linked_posts TEXT DEFAULT NULL,
  image_id TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Step 2: Copy all data
INSERT INTO posts_new SELECT * FROM posts;

-- Step 3: Drop old table
DROP TABLE posts;

-- Step 4: Rename new table
ALTER TABLE posts_new RENAME TO posts;

-- Step 5: Recreate indices
CREATE INDEX IF NOT EXISTS idx_posts_instance ON posts(instance);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_is_personal ON posts(is_personal);
