SELECT
  (SELECT value FROM wavero_meta WHERE key = 'schema_version') AS schema_version,
  (SELECT COUNT(*) FROM sqlite_master WHERE type = 'table') AS table_count,
  (SELECT type FROM chats WHERE id = 'system-channel-wavero') AS system_type,
  (SELECT description IS NOT NULL FROM chats WHERE id = 'system-channel-wavero')
    AS description_not_null;
