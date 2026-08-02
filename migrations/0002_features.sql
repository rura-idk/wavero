-- Feature tables formerly created by worker.js at request time.
-- Apply once with Wrangler before deploying code that requires schema version 2.

CREATE TABLE IF NOT EXISTS wavero_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wavero_profiles (
  user_id TEXT PRIMARY KEY,
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'dark'
    CHECK (theme IN ('dark', 'light', 'system')),
  sound_enabled INTEGER NOT NULL DEFAULT 1 CHECK (sound_enabled IN (0, 1)),
  notifications_enabled INTEGER NOT NULL DEFAULT 1
    CHECK (notifications_enabled IN (0, 1)),
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wavero_chat_state (
  chat_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_read_at TEXT,
  archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0, 1)),
  muted INTEGER NOT NULL DEFAULT 0 CHECK (muted IN (0, 1)),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (chat_id, user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wavero_message_replies (
  message_id TEXT PRIMARY KEY,
  reply_to_message_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (message_id) REFERENCES messages(id),
  FOREIGN KEY (reply_to_message_id) REFERENCES messages(id)
);

CREATE TABLE IF NOT EXISTS wavero_message_reactions (
  message_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  emoji TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (message_id, user_id, emoji),
  FOREIGN KEY (message_id) REFERENCES messages(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wavero_pinned_messages (
  chat_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  pinned_by_user_id TEXT NOT NULL,
  pinned_at TEXT NOT NULL,
  PRIMARY KEY (chat_id, message_id),
  FOREIGN KEY (chat_id) REFERENCES chats(id),
  FOREIGN KEY (message_id) REFERENCES messages(id),
  FOREIGN KEY (pinned_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wavero_invites (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT NOT NULL,
  expires_at TEXT,
  max_uses INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL,
  FOREIGN KEY (chat_id) REFERENCES chats(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  CHECK (max_uses IS NULL OR max_uses > 0),
  CHECK (use_count >= 0)
);

CREATE TABLE IF NOT EXISTS wavero_blocks_v1 (
  blocker_user_id TEXT NOT NULL,
  blocked_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (blocker_user_id, blocked_user_id),
  FOREIGN KEY (blocker_user_id) REFERENCES users(id),
  FOREIGN KEY (blocked_user_id) REFERENCES users(id),
  CHECK (blocker_user_id <> blocked_user_id)
);

CREATE TABLE IF NOT EXISTS wavero_reports_v1 (
  id TEXT PRIMARY KEY,
  reporter_user_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'chat', 'message')),
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'reviewing', 'resolved', 'rejected')),
  resolution TEXT NOT NULL DEFAULT '',
  handled_by_user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id),
  FOREIGN KEY (handled_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wavero_admin_actions (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (admin_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wavero_oauth_identities (
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  provider_login TEXT NOT NULL DEFAULT '',
  provider_email TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (provider, provider_user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wavero_access_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wavero_oauth_tickets (
  ticket_hash TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_wavero_chat_state_user
  ON wavero_chat_state(user_id, archived, updated_at);
CREATE INDEX IF NOT EXISTS idx_wavero_reactions_message
  ON wavero_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_wavero_replies_target
  ON wavero_message_replies(reply_to_message_id);
CREATE INDEX IF NOT EXISTS idx_wavero_pins_chat
  ON wavero_pinned_messages(chat_id, pinned_at);
CREATE INDEX IF NOT EXISTS idx_wavero_invites_chat
  ON wavero_invites(chat_id, is_active);
CREATE INDEX IF NOT EXISTS idx_wavero_blocks_blocked
  ON wavero_blocks_v1(blocked_user_id);
CREATE INDEX IF NOT EXISTS idx_wavero_reports_status
  ON wavero_reports_v1(status, created_at);
CREATE INDEX IF NOT EXISTS idx_wavero_oauth_identity_user
  ON wavero_oauth_identities(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_wavero_access_sessions_user
  ON wavero_access_sessions(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_wavero_oauth_tickets_expiry
  ON wavero_oauth_tickets(expires_at, used_at);

INSERT INTO wavero_meta(key, value, updated_at)
VALUES ('schema_version', '2', CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE
SET value = excluded.value, updated_at = excluded.updated_at;
