-- ============================================================
-- B/CONTENT — D1 Database Schema
-- Run: wrangler d1 execute b-content-db --local --file=db/schema.sql
-- ============================================================

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  instance TEXT NOT NULL CHECK(instance IN ('alex', 'ablas', 'bwg')),
  content_type TEXT NOT NULL,
  topic_fields TEXT NOT NULL DEFAULT '[]', -- JSON array of TopicFieldIds
  text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK(language IN ('en', 'de')),
  hashtags TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  char_count INTEGER NOT NULL DEFAULT 0,
  is_personal INTEGER NOT NULL DEFAULT 0, -- boolean: 0/1
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'review', 'approved', 'published')),
  linked_posts TEXT DEFAULT NULL, -- JSON array of post IDs (orchestration)
  image_id TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Generated images table
CREATE TABLE IF NOT EXISTS generated_images (
  id TEXT PRIMARY KEY,
  format TEXT NOT NULL CHECK(format IN ('single-square', 'single-landscape', 'single-portrait', 'carousel-slide', 'company-banner')),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  url TEXT NOT NULL, -- R2 storage URL
  template_id TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indices for common queries
CREATE INDEX IF NOT EXISTS idx_posts_instance ON posts(instance);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_is_personal ON posts(is_personal);
