-- ============================================================
-- Migration 004: Interview Pipeline (Z-003)
-- Stores audio interview transcripts and AI-extracted items
-- Run: wrangler d1 execute b-content-db --remote --file=db/migration-004-interviews.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  transcript TEXT NOT NULL,
  extracted_items TEXT NOT NULL DEFAULT '[]',
  imported_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processed'
    CHECK(status IN ('processing', 'processed', 'imported', 'failed')),
  duration_seconds INTEGER DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_interviews_created_at ON interviews(created_at);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
