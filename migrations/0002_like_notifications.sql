-- One Telegram notification per visitor and project, even if they unlike and like again.
CREATE TABLE IF NOT EXISTS like_notifications (
  slug TEXT NOT NULL,
  visitor TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (slug, visitor)
);
CREATE INDEX IF NOT EXISTS like_notifications_created ON like_notifications (created_at);
