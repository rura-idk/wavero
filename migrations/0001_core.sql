-- Baseline schema reconstructed from the queries used by Wavero main@c5d56bf.
-- This migration is additive and does not remove or rewrite production data.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  firebase_uid TEXT,
  email TEXT NOT NULL,
  email_normalized TEXT NOT NULL,
  email_verified_at TEXT,
  username TEXT NOT NULL,
  username_normalized TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL DEFAULT 'external_identity',
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'moderator', 'admin', 'owner')),
  status TEXT NOT NULL DEFAULT 'pending_verification'
    CHECK (status IN ('pending_verification', 'active', 'suspended', 'deleted')),
  last_seen_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_firebase_uid_unique
  ON users(firebase_uid)
  WHERE firebase_uid IS NOT NULL AND firebase_uid <> '';
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_normalized_unique
  ON users(email_normalized);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_normalized_unique
  ON users(username_normalized);
CREATE INDEX IF NOT EXISTS idx_users_status_created
  ON users(status, created_at DESC);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (
    type IN ('private', 'group', 'channel', 'saved', 'admin_channel')
  ),
  title TEXT,
  username TEXT,
  username_normalized TEXT,
  description TEXT NOT NULL DEFAULT '',
  owner_user_id TEXT,
  is_system INTEGER NOT NULL DEFAULT 0 CHECK (is_system IN (0, 1)),
  is_public INTEGER NOT NULL DEFAULT 0 CHECK (is_public IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_chats_username_normalized_unique
  ON chats(username_normalized)
  WHERE username_normalized IS NOT NULL
    AND username_normalized <> ''
    AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_chats_public_directory
  ON chats(is_public, type, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS chat_members (
  chat_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (
    role IN ('owner', 'admin', 'moderator', 'member', 'subscriber')
  ),
  joined_at TEXT NOT NULL,
  left_at TEXT,
  is_banned INTEGER NOT NULL DEFAULT 0 CHECK (is_banned IN (0, 1)),
  PRIMARY KEY (chat_id, user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_chat_members_user_active
  ON chat_members(user_id, left_at, is_banned, chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_members_chat_active
  ON chat_members(chat_id, left_at, is_banned, role);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  sender_user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  text TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  edited_at TEXT,
  deleted_at TEXT,
  deleted_for_everyone INTEGER NOT NULL DEFAULT 0
    CHECK (deleted_for_everyone IN (0, 1)),
  FOREIGN KEY (chat_id) REFERENCES chats(id),
  FOREIGN KEY (sender_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_history
  ON messages(chat_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender
  ON messages(sender_user_id, created_at DESC);

INSERT OR IGNORE INTO chats (
  id, type, title, username, username_normalized, description,
  owner_user_id, is_system, is_public, created_at, updated_at
) VALUES (
  'system-channel-wavero', 'admin_channel', 'Wavero',
  'wavero', 'wavero', 'Системные объявления Wavero',
  NULL, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);
