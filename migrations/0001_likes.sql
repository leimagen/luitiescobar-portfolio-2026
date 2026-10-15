-- One row per (project, visitor). The visitor is an anonymous, salted hash —
-- no IP address or personal data is stored.
CREATE TABLE IF NOT EXISTS likes (
  slug       TEXT    NOT NULL,
  visitor    TEXT    NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (slug, visitor)
);
