-- Rate limit for the contact form: one row per message (anonymous visitor hash + time). No message content is stored.
CREATE TABLE IF NOT EXISTS contact_rate (
  visitor TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS contact_rate_visitor ON contact_rate (visitor, created_at);
