export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  operation TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  retry_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'PENDING',
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS cached_leads (
  id TEXT PRIMARY KEY NOT NULL,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cached_deals (
  id TEXT PRIMARY KEY NOT NULL,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cached_tasks (
  id TEXT PRIMARY KEY NOT NULL,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
`;
