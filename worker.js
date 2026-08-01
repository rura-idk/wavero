import indexHtml from "./index.html";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

const EXTENSION_SCHEMA = `CREATE TABLE IF NOT EXISTS wavero_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS wavero_profiles (
  user_id TEXT PRIMARY KEY,
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark','light','system')),
  sound_enabled INTEGER NOT NULL DEFAULT 1 CHECK (sound_enabled IN (0,1)),
  notifications_enabled INTEGER NOT NULL DEFAULT 1 CHECK (notifications_enabled IN (0,1)),
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS wavero_chat_state (
  chat_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_read_at TEXT,
  archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0,1)),
  muted INTEGER NOT NULL DEFAULT 0 CHECK (muted IN (0,1)),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (chat_id, user_id)
);
CREATE TABLE IF NOT EXISTS wavero_message_replies (
  message_id TEXT PRIMARY KEY,
  reply_to_message_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS wavero_message_reactions (
  message_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  emoji TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (message_id, user_id, emoji)
);
CREATE TABLE IF NOT EXISTS wavero_pinned_messages (
  chat_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  pinned_by_user_id TEXT NOT NULL,
  pinned_at TEXT NOT NULL,
  PRIMARY KEY (chat_id, message_id)
);
CREATE TABLE IF NOT EXISTS wavero_invites (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT NOT NULL,
  expires_at TEXT,
  max_uses INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS wavero_blocks_v1 (
  blocker_user_id TEXT NOT NULL,
  blocked_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (blocker_user_id, blocked_user_id)
);
CREATE TABLE IF NOT EXISTS wavero_reports_v1 (
  id TEXT PRIMARY KEY,
  reporter_user_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('user','chat','message')),
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewing','resolved','rejected')),
  resolution TEXT NOT NULL DEFAULT '',
  handled_by_user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS wavero_admin_actions (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_wavero_chat_state_user ON wavero_chat_state(user_id, archived, updated_at);
CREATE INDEX IF NOT EXISTS idx_wavero_reactions_message ON wavero_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_wavero_replies_target ON wavero_message_replies(reply_to_message_id);
CREATE INDEX IF NOT EXISTS idx_wavero_pins_chat ON wavero_pinned_messages(chat_id, pinned_at);
CREATE INDEX IF NOT EXISTS idx_wavero_invites_chat ON wavero_invites(chat_id, is_active);
CREATE INDEX IF NOT EXISTS idx_wavero_blocks_blocked ON wavero_blocks_v1(blocked_user_id);
CREATE INDEX IF NOT EXISTS idx_wavero_reports_status ON wavero_reports_v1(status, created_at);
INSERT INTO wavero_meta(key, value, updated_at)
VALUES ('schema_version', '1.0.0', CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at;`;
let schemaPromise = null;

async function ensureSchema(env) {
  if (!env.DB) throw new ApiError(500, "База данных не подключена.", "DB_NOT_CONFIGURED");
  if (!schemaPromise) {
    schemaPromise = env.DB.exec(EXTENSION_SCHEMA).catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

export default {
  async fetch(request, env) {
    const requestId = request.headers.get("cf-ray") || crypto.randomUUID();
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    try {
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/health") {
        let schemaReady = false;
        let schemaVersion = null;
        if (env.DB) {
          try {
            await ensureSchema(env);
            const meta = await env.DB.prepare("SELECT value FROM wavero_meta WHERE key='schema_version' LIMIT 1").first();
            schemaVersion = meta?.value || null;
            schemaReady = schemaVersion === "1.0.0";
          } catch (error) {
            console.error("WAVERO_HEALTH_SCHEMA", { requestId, message: error?.message, stack: error?.stack });
          }
        }
        return json({
          ok: true,
          service: "wavero-api",
          version: "1.0.0-core",
          schemaVersion,
          schemaReady,
          firebaseConfigured: Boolean(env.FIREBASE_API_KEY && env.FIREBASE_PROJECT_ID),
          databaseConfigured: Boolean(env.DB),
        });
      }

      const isApi = url.pathname.startsWith("/api/") || url.pathname.startsWith("/mobile/") || url.pathname === "/directory";
      if (isApi) await ensureSchema(env);

      if (request.method === "POST" && url.pathname === "/api/auth/register") return register(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/login") return login(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/refresh") return refreshSession(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/resend-verification") return resendVerification(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/reset-password") return resetPassword(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/sync") return syncAuthenticatedUser(request, env);

      if (request.method === "GET" && url.pathname === "/api/bootstrap") return bootstrap(request, env);
      if (request.method === "GET" && url.pathname === "/api/me/chats") return listMyChats(request, env);
      if (request.method === "GET" && url.pathname === "/api/me/profile") return getMyProfile(request, env);
      if (request.method === "PATCH" && url.pathname === "/api/me/profile") return updateMyProfile(request, env);
      if (request.method === "GET" && url.pathname === "/api/me/blocks") return listBlocks(request, env);

      const blockMatch = url.pathname.match(/^\/api\/me\/blocks\/([^/]+)$/);
      if (blockMatch && request.method === "POST") return blockUser(request, env, decodeURIComponent(blockMatch[1]));
      if (blockMatch && request.method === "DELETE") return unblockUser(request, env, decodeURIComponent(blockMatch[1]));

      if (request.method === "GET" && url.pathname === "/directory") return searchDirectory(request, env, url);
      if ((request.method === "GET" || request.method === "POST") && url.pathname === "/api/directory") return searchDirectory(request, env, url);

      if (request.method === "POST" && url.pathname === "/api/chats/direct") return createOrOpenDirectChat(request, env);
      if (request.method === "POST" && url.pathname === "/mobile/direct-chat") return createOrOpenDirectChatMobile(request, env);
      if (request.method === "POST" && url.pathname === "/api/chats") return createChat(request, env);

      const chatMatch = url.pathname.match(/^\/api\/chats\/([^/]+)$/);
      if (chatMatch && request.method === "GET") return getChat(request, env, decodeURIComponent(chatMatch[1]));
      if (chatMatch && request.method === "PATCH") return updateChat(request, env, decodeURIComponent(chatMatch[1]));
      if (chatMatch && request.method === "DELETE") return deleteOrLeaveChat(request, env, decodeURIComponent(chatMatch[1]));

      const membersMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/members$/);
      if (membersMatch && request.method === "GET") return listChatMembers(request, env, decodeURIComponent(membersMatch[1]));
      if (membersMatch && request.method === "POST") return addChatMember(request, env, decodeURIComponent(membersMatch[1]));

      const memberMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/members\/([^/]+)$/);
      if (memberMatch && request.method === "PATCH") return updateChatMember(request, env, decodeURIComponent(memberMatch[1]), decodeURIComponent(memberMatch[2]));
      if (memberMatch && request.method === "DELETE") return removeChatMember(request, env, decodeURIComponent(memberMatch[1]), decodeURIComponent(memberMatch[2]));

      const messagesMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/messages$/);
      if (messagesMatch && request.method === "GET") return listMessages(request, env, decodeURIComponent(messagesMatch[1]), url);
      if (messagesMatch && request.method === "POST") return sendMessage(request, env, decodeURIComponent(messagesMatch[1]));

      const messageSearchMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/search$/);
      if (messageSearchMatch && request.method === "GET") return searchMessages(request, env, decodeURIComponent(messageSearchMatch[1]), url);

      const readMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/read$/);
      if (readMatch && request.method === "POST") return markChatRead(request, env, decodeURIComponent(readMatch[1]));

      const inviteMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/invites$/);
      if (inviteMatch && request.method === "POST") return createInvite(request, env, decodeURIComponent(inviteMatch[1]));
      const joinInviteMatch = url.pathname.match(/^\/api\/invites\/([^/]+)\/join$/);
      if (joinInviteMatch && request.method === "POST") return joinInvite(request, env, decodeURIComponent(joinInviteMatch[1]));

      const messageMatch = url.pathname.match(/^\/api\/messages\/([^/]+)$/);
      if (messageMatch && request.method === "PATCH") return editMessage(request, env, decodeURIComponent(messageMatch[1]));
      if (messageMatch && request.method === "DELETE") return deleteMessage(request, env, decodeURIComponent(messageMatch[1]));

      const reactionMatch = url.pathname.match(/^\/api\/messages\/([^/]+)\/reactions$/);
      if (reactionMatch && request.method === "POST") return setReaction(request, env, decodeURIComponent(reactionMatch[1]));
      if (reactionMatch && request.method === "DELETE") return removeReaction(request, env, decodeURIComponent(reactionMatch[1]));

      const pinMatch = url.pathname.match(/^\/api\/messages\/([^/]+)\/pin$/);
      if (pinMatch && request.method === "POST") return pinMessage(request, env, decodeURIComponent(pinMatch[1]));
      if (pinMatch && request.method === "DELETE") return unpinMessage(request, env, decodeURIComponent(pinMatch[1]));

      if (request.method === "POST" && url.pathname === "/api/reports") return createReport(request, env);
      if (request.method === "GET" && url.pathname === "/api/admin/overview") return adminOverview(request, env, url);

      const adminUserMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
      if (adminUserMatch && request.method === "PATCH") return adminUpdateUser(request, env, decodeURIComponent(adminUserMatch[1]));
      const adminReportMatch = url.pathname.match(/^\/api\/admin\/reports\/([^/]+)$/);
      if (adminReportMatch && request.method === "PATCH") return adminUpdateReport(request, env, decodeURIComponent(adminReportMatch[1]));

      const isApiPath = isApi || url.pathname === "/health";
      if (request.method === "GET" && !isApiPath) return html(renderIndexHtml(indexHtml, env));
      return json({ ok: false, code: "ROUTE_NOT_FOUND", error: "Маршрут не найден." }, 404);
    } catch (error) {
      const code = error instanceof ApiError ? error.code : "INTERNAL_ERROR";
      console.error("WAVERO_ERROR", {
        requestId,
        code,
        method: request.method,
        url: request.url,
        message: error?.message,
        stack: error?.stack,
      });
      if (error instanceof ApiError) return json({ ok: false, code: error.code, error: error.message, request_id: requestId }, error.status);
      return json({ ok: false, code: "INTERNAL_ERROR", error: "Внутренняя ошибка сервера.", request_id: requestId }, 500);
    }
  },
};

async function register(request, env) {
  requireFirebase(env);
  const body = await readJson(request);

  const email = clean(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const username = clean(body.username).toLowerCase();
  const displayName = clean(body.display_name);

  const validation = validateRegistration(email, password, username, displayName);
  if (validation) return json({ ok: false, error: validation }, 400);

  const reserved = new Set([
    "admin", "administrator", "moderator", "support",
    "system", "security", "wavero"
  ]);
  if (reserved.has(username)) {
    return json({ ok: false, error: "Этот username зарезервирован." }, 400);
  }

  const conflict = await env.DB.prepare(`
    SELECT email_normalized, username_normalized
    FROM users
    WHERE email_normalized = ?1 OR username_normalized = ?2
    LIMIT 1
  `).bind(email, username).first();

  if (conflict?.email_normalized === email) {
    return json({ ok: false, error: "Этот email уже используется." }, 409);
  }
  if (conflict?.username_normalized === username) {
    return json({ ok: false, error: "Этот username уже занят." }, 409);
  }

  const signUp = await firebaseRequest(env, "accounts:signUp", {
    email,
    password,
    returnSecureToken: true,
  });

  await firebaseRequest(env, "accounts:update", {
    idToken: signUp.idToken,
    displayName,
    returnSecureToken: true,
  });

  await sendVerification(env, signUp.idToken);

  return json({
    ok: true,
    message: "Аккаунт создан. Подтвердите email и затем войдите.",
    pending_profile: { username, display_name: displayName },
  }, 201);
}

async function login(request, env) {
  requireFirebase(env);
  const body = await readJson(request);

  const identifier = clean(body.identifier || body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!identifier || !password) {
    return json({
      ok: false,
      code: "INVALID_CREDENTIALS",
      error: "Неправильный пароль, почта или логин.",
    }, 401);
  }

  let email = identifier;

  // If the user entered a username, resolve it to the verified email stored in D1.
  if (!identifier.includes("@")) {
    if (!env.DB) {
      throw new ApiError(500, "База данных не подключена.");
    }

    const user = await env.DB.prepare(`
      SELECT email_normalized
      FROM users
      WHERE username_normalized = ?1
        AND status NOT IN ('suspended', 'deleted')
      LIMIT 1
    `).bind(identifier).first();

    if (!user?.email_normalized) {
      return json({
        ok: false,
        code: "INVALID_CREDENTIALS",
        error: "Неправильный пароль, почта или логин.",
      }, 401);
    }

    email = user.email_normalized;
  }

  let auth;
  try {
    auth = await firebaseRequest(env, "accounts:signInWithPassword", {
      email,
      password,
      returnSecureToken: true,
    });
  } catch (error) {
    if (
      error instanceof ApiError &&
      [400, 401, 403].includes(error.status)
    ) {
      return json({
        ok: false,
        code: "INVALID_CREDENTIALS",
        error: "Неправильный пароль, почта или логин.",
      }, 401);
    }
    throw error;
  }

  const account = await lookupFirebaseUser(env, auth.idToken);

  if (!account.emailVerified) {
    await sendVerification(env, auth.idToken);
    return json({
      ok: false,
      code: "EMAIL_NOT_VERIFIED",
      error: "Email ещё не подтверждён. Новое письмо отправлено.",
    }, 403);
  }

  return json({
    ok: true,
    id_token: auth.idToken,
    refresh_token: auth.refreshToken,
    expires_in: Number(auth.expiresIn || 3600),
    firebase_user: {
      uid: account.localId,
      email: account.email,
      display_name: account.displayName || "",
      email_verified: Boolean(account.emailVerified),
    },
  });
}


async function refreshSession(request, env) {
  requireFirebase(env);
  const body = await readJson(request);
  const refreshToken = clean(body.refresh_token);

  if (!refreshToken) {
    throw new ApiError(401, "Сессия истекла.");
  }

  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(401, "Сессия истекла. Войдите снова.");
  }

  return json({
    ok: true,
    id_token: data.id_token,
    refresh_token: data.refresh_token,
    expires_in: Number(data.expires_in || 3600),
  });
}

async function resendVerification(request, env) {
  requireFirebase(env);
  const body = await readJson(request);
  const email = clean(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  const auth = await firebaseRequest(env, "accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });

  await sendVerification(env, auth.idToken);
  return json({ ok: true, message: "Письмо подтверждения отправлено." });
}

async function resetPassword(request, env) {
  requireFirebase(env);
  const body = await readJson(request);
  const email = clean(body.email).toLowerCase();

  if (!email) return json({ ok: false, error: "Введите email." }, 400);

  await firebaseRequest(env, "accounts:sendOobCode", {
    requestType: "PASSWORD_RESET",
    email,
  });

  return json({
    ok: true,
    message: "Если аккаунт существует, письмо для восстановления отправлено.",
  });
}

async function syncAuthenticatedUser(request, env) {
  requireFirebase(env);
  if (!env.DB) throw new Error("DB binding is missing");

  const idToken = bearerToken(request);
  if (!idToken) return json({ ok: false, error: "Требуется авторизация." }, 401);

  const account = await lookupFirebaseUser(env, idToken);
  if (!account.emailVerified) {
    return json({ ok: false, error: "Сначала подтвердите email." }, 403);
  }

  const body = await readJson(request, true);
  const firebaseUid = account.localId;
  const email = clean(account.email).toLowerCase();
  const now = new Date().toISOString();

  let user = await env.DB.prepare(`
    SELECT id, firebase_uid, email, username, display_name, role, status
    FROM users
    WHERE firebase_uid = ?1
    LIMIT 1
  `).bind(firebaseUid).first();

  if (user) {
    await env.DB.prepare(`
      UPDATE users
      SET email = ?1,
          email_normalized = ?1,
          email_verified_at = COALESCE(email_verified_at, ?2),
          last_seen_at = ?2,
          updated_at = ?2,
          status = CASE WHEN status = 'pending_verification' THEN 'active' ELSE status END
      WHERE firebase_uid = ?3
    `).bind(email, now, firebaseUid).run();

    return json({
      ok: true,
      created: false,
      user: { ...user, email, status: user.status === "pending_verification" ? "active" : user.status },
    });
  }

  const username = clean(body.username).toLowerCase();
  const displayName = clean(body.display_name || account.displayName);

  const validation = validateProfile(username, displayName);
  if (validation) {
    return json({ ok: false, code: "PROFILE_REQUIRED", error: validation }, 400);
  }

  const conflict = await env.DB.prepare(`
    SELECT email_normalized, username_normalized
    FROM users
    WHERE email_normalized = ?1 OR username_normalized = ?2
    LIMIT 1
  `).bind(email, username).first();

  if (conflict?.email_normalized === email) {
    return json({ ok: false, error: "Этот email уже связан с другим профилем." }, 409);
  }
  if (conflict?.username_normalized === username) {
    return json({ ok: false, error: "Этот username уже занят." }, 409);
  }

  const userId = crypto.randomUUID();

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO users (
        id, firebase_uid, email, email_normalized, email_verified_at,
        username, username_normalized, display_name, password_hash,
        role, status, last_seen_at, created_at, updated_at
      ) VALUES (
        ?1, ?2, ?3, ?3, ?4,
        ?5, ?5, ?6, 'firebase_managed',
        'user', 'active', ?4, ?4, ?4
      )
    `).bind(userId, firebaseUid, email, now, username, displayName),

    env.DB.prepare(`
      INSERT OR IGNORE INTO chat_members (
        chat_id, user_id, role, joined_at
      ) VALUES ('system-channel-wavero', ?1, 'subscriber', ?2)
    `).bind(userId, now),
  ]);

  return json({
    ok: true,
    created: true,
    user: {
      id: userId,
      firebase_uid: firebaseUid,
      email,
      username,
      display_name: displayName,
      role: "user",
      status: "active",
    },
  }, 201);
}


async function authenticatedD1User(request, env) {
  return authenticatedD1UserByToken(env, bearerToken(request));
}

async function authenticatedD1UserByToken(env, idToken) {
  if (!idToken) throw new ApiError(401, "Требуется авторизация.");

  const account = await lookupFirebaseUser(env, idToken);
  if (!account.emailVerified) throw new ApiError(403, "Сначала подтвердите email.");

  const user = await env.DB.prepare(`
    SELECT id, firebase_uid, email, username, display_name, role, status
    FROM users
    WHERE firebase_uid = ?1
    LIMIT 1
  `).bind(account.localId).first();

  if (!user || (user.status && user.status !== "active")) {
    throw new ApiError(403, "Профиль недоступен.");
  }

  return user;
}


async function searchDirectory(request, env, url) {
  if (!env.DB) {
    throw new ApiError(500, "База данных не подключена.");
  }

  let rawQuery = url.searchParams.get("q") || "";

  if (request.method === "POST") {
    const body = await readJson(request, true);
    rawQuery = body.query ?? rawQuery;
  }

  const query = normalizeDirectoryQuery(rawQuery);

  if (query.length < 2) {
    return json({ ok: true, users: [] });
  }

  const pattern = `%${escapeLike(query)}%`;
  const exact = query.toLowerCase();
  const excludeId = clean(url.searchParams.get("exclude"));

  const result = await env.DB.prepare(`
    SELECT
      id,
      username,
      display_name
    FROM users
    WHERE COALESCE(status, 'active') = 'active'
      AND username IS NOT NULL
      AND username <> ''
      AND (?3 = '' OR id <> ?3)
      AND NOT EXISTS (
        SELECT 1 FROM wavero_blocks_v1 b
        WHERE ?3 <> '' AND (
          (b.blocker_user_id = ?3 AND b.blocked_user_id = users.id)
          OR (b.blocker_user_id = users.id AND b.blocked_user_id = ?3)
        )
      )
      AND (
        LOWER(COALESCE(username_normalized, username)) LIKE ?1 ESCAPE '\\'
        OR LOWER(COALESCE(display_name, '')) LIKE ?1 ESCAPE '\\'
        OR LOWER(COALESCE(email, '')) = ?2
      )
    ORDER BY
      CASE
        WHEN LOWER(COALESCE(username_normalized, username)) = ?2 THEN 0
        WHEN LOWER(COALESCE(username_normalized, username)) LIKE ?2 || '%' THEN 1
        ELSE 2
      END,
      LOWER(COALESCE(username_normalized, username)) ASC
    LIMIT 20
  `).bind(pattern, exact, excludeId).all();

  return json({
    ok: true,
    users: (result.results || []).map((user) => ({
      id: user.id,
      username: clean(user.username),
      display_name: clean(user.display_name) || clean(user.username),
    })),
  });
}

function normalizeDirectoryQuery(value) {
  return clean(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/\s+/g, " ")
    .slice(0, 64);
}

function escapeLike(value) {
  return value.replace(/[\\%_]/g, (symbol) => `\\${symbol}`);
}

async function createOrOpenDirectChat(request, env) {
  const currentUser = await authenticatedD1User(request, env);
  const body = await readJson(request);
  const targetUserId = clean(body.target_user_id);
  const targetUsername = clean(body.username).toLowerCase();

  if (!targetUserId && !targetUsername) {
    throw new ApiError(400, "Не указан пользователь.");
  }

  const target = targetUserId
    ? await env.DB.prepare(`
        SELECT id, username, display_name
        FROM users
        WHERE id = ?1
          AND COALESCE(status, 'active') = 'active'
        LIMIT 1
      `).bind(targetUserId).first()
    : await env.DB.prepare(`
        SELECT id, username, display_name
        FROM users
        WHERE LOWER(COALESCE(username_normalized, username)) = ?1
          AND COALESCE(status, 'active') = 'active'
        LIMIT 1
      `).bind(targetUsername).first();

  return createOrFindDirectChat(env, currentUser, target);
}

async function createOrOpenDirectChatMobile(request, env) {
  const body = await readJson(request);
  const idToken = clean(body.id_token);
  const targetUserId = clean(body.target_user_id);

  if (!targetUserId) {
    throw new ApiError(400, "Не указан пользователь.");
  }

  const currentUser = await authenticatedD1UserByToken(env, idToken);

  const target = await env.DB.prepare(`
    SELECT id, username, display_name
    FROM users
    WHERE id = ?1
      AND COALESCE(status, 'active') = 'active'
    LIMIT 1
  `).bind(targetUserId).first();

  return createOrFindDirectChat(env, currentUser, target);
}

async function createOrFindDirectChat(env, currentUser, target) {
  if (!target) {
    throw new ApiError(404, "Пользователь не найден.");
  }

  if (String(target.id) === String(currentUser.id)) {
    throw new ApiError(400, "Нельзя создать диалог с самим собой.", "DIRECT_SELF");
  }

  const blocked = await env.DB.prepare(`
    SELECT 1 AS blocked
    FROM wavero_blocks_v1
    WHERE (blocker_user_id = ?1 AND blocked_user_id = ?2)
       OR (blocker_user_id = ?2 AND blocked_user_id = ?1)
    LIMIT 1
  `).bind(currentUser.id, target.id).first();
  if (blocked) throw new ApiError(403, "Диалог с этим пользователем недоступен.", "USER_BLOCKED");

  const existing = await env.DB.prepare(`
    SELECT c.id
    FROM chats c
    INNER JOIN chat_members mine
      ON mine.chat_id = c.id
      AND mine.user_id = ?1
      AND mine.left_at IS NULL
    INNER JOIN chat_members theirs
      ON theirs.chat_id = c.id
      AND theirs.user_id = ?2
      AND theirs.left_at IS NULL
    WHERE c.type = 'private'
      AND c.deleted_at IS NULL
      AND (
        SELECT COUNT(*)
        FROM chat_members all_members
        WHERE all_members.chat_id = c.id
          AND all_members.left_at IS NULL
      ) = 2
    LIMIT 1
  `).bind(currentUser.id, target.id).first();

  if (existing?.id) {
    return json({
      ok: true,
      created: false,
      chat_id: existing.id,
      user: {
        id: target.id,
        username: target.username,
        display_name: target.display_name || target.username,
      },
    });
  }

  const chatId = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO chats (
        id,
        type,
        title,
        description,
        owner_user_id,
        is_system,
        is_public,
        created_at,
        updated_at
      )
      VALUES (
        ?1,
        'private',
        NULL,
        '',
        ?2,
        0,
        0,
        ?3,
        ?3
      )
    `).bind(chatId, currentUser.id, now),

    env.DB.prepare(`
      INSERT INTO chat_members (
        chat_id,
        user_id,
        role,
        joined_at
      )
      VALUES (?1, ?2, 'member', ?3)
    `).bind(chatId, currentUser.id, now),

    env.DB.prepare(`
      INSERT INTO chat_members (
        chat_id,
        user_id,
        role,
        joined_at
      )
      VALUES (?1, ?2, 'member', ?3)
    `).bind(chatId, target.id, now),
  ]);

  return json({
    ok: true,
    created: true,
    chat_id: chatId,
    user: {
      id: target.id,
      username: target.username,
      display_name: target.display_name || target.username,
    },
  }, 201);
}

async function bootstrap(request, env) {
  const user = await authenticatedD1User(request, env);
  const [profile, chats] = await Promise.all([
    loadProfile(env, user),
    queryMyChats(env, user),
  ]);
  return json({ ok: true, user, profile, settings: profile, chats, is_admin: isGlobalAdmin(user) });
}

async function listMyChats(request, env) {
  const user = await authenticatedD1User(request, env);
  return json({ ok: true, user, chats: await queryMyChats(env, user) });
}

async function queryMyChats(env, user) {
  const result = await env.DB.prepare(`
    SELECT
      c.id,
      c.type,
      CASE WHEN c.type = 'private' THEN (
        SELECT other_user.display_name
        FROM chat_members other_member
        INNER JOIN users other_user ON other_user.id = other_member.user_id
        WHERE other_member.chat_id = c.id AND other_member.user_id <> ?1 AND other_member.left_at IS NULL
        LIMIT 1
      ) ELSE c.title END AS title,
      CASE WHEN c.type = 'private' THEN (
        SELECT other_user.username
        FROM chat_members other_member
        INNER JOIN users other_user ON other_user.id = other_member.user_id
        WHERE other_member.chat_id = c.id AND other_member.user_id <> ?1 AND other_member.left_at IS NULL
        LIMIT 1
      ) ELSE c.username END AS username,
      CASE WHEN c.type = 'private' THEN (
        SELECT other_user.id
        FROM chat_members other_member
        INNER JOIN users other_user ON other_user.id = other_member.user_id
        WHERE other_member.chat_id = c.id AND other_member.user_id <> ?1 AND other_member.left_at IS NULL
        LIMIT 1
      ) ELSE NULL END AS peer_user_id,
      c.description,
      c.is_public,
      c.is_system,
      cm.role,
      COALESCE(ws.archived, 0) AS archived,
      COALESCE(ws.muted, 0) AS muted,
      (SELECT m.text FROM messages m WHERE m.chat_id=c.id AND m.deleted_at IS NULL AND m.deleted_for_everyone=0 ORDER BY m.created_at DESC LIMIT 1) AS last_message,
      (SELECT m.created_at FROM messages m WHERE m.chat_id=c.id AND m.deleted_at IS NULL AND m.deleted_for_everyone=0 ORDER BY m.created_at DESC LIMIT 1) AS last_message_at,
      (SELECT COUNT(*) FROM messages unread
       WHERE unread.chat_id=c.id AND unread.deleted_at IS NULL AND unread.deleted_for_everyone=0
         AND unread.sender_user_id <> ?1
         AND unread.created_at > COALESCE(ws.last_read_at, '1970-01-01T00:00:00.000Z')) AS unread_count,
      (SELECT COUNT(*) FROM chat_members members WHERE members.chat_id=c.id AND members.left_at IS NULL AND members.is_banned=0) AS member_count
    FROM chat_members cm
    INNER JOIN chats c ON c.id=cm.chat_id
    LEFT JOIN wavero_chat_state ws ON ws.chat_id=c.id AND ws.user_id=?1
    WHERE cm.user_id=?1 AND cm.left_at IS NULL AND cm.is_banned=0 AND c.deleted_at IS NULL
    ORDER BY COALESCE(ws.archived,0) ASC, COALESCE(last_message_at,c.updated_at,c.created_at) DESC
  `).bind(user.id).all();
  return result.results || [];
}

async function ensureChatAccess(env, chatId, userId) {
  const membership = await env.DB.prepare(`
    SELECT cm.role, c.type, c.title, c.username, c.description, c.is_public, c.is_system,
           c.owner_user_id, c.id AS chat_id
    FROM chat_members cm
    INNER JOIN chats c ON c.id=cm.chat_id
    WHERE cm.chat_id=?1 AND cm.user_id=?2 AND cm.left_at IS NULL AND cm.is_banned=0 AND c.deleted_at IS NULL
    LIMIT 1
  `).bind(chatId, userId).first();
  if (!membership) throw new ApiError(403, "Нет доступа к чату.", "CHAT_ACCESS_DENIED");
  return membership;
}

async function listMessages(request, env, chatId, url) {
  const user = await authenticatedD1User(request, env);
  const membership = await ensureChatAccess(env, chatId, user.id);
  const limitRaw = Number.parseInt(url.searchParams.get("limit") || "80", 10);
  const limit = Math.max(1, Math.min(150, Number.isFinite(limitRaw) ? limitRaw : 80));

  const result = await env.DB.prepare(`
    SELECT m.id,m.chat_id,m.sender_user_id,m.type,m.text,m.created_at,m.edited_at,
      u.username AS sender_username,u.display_name AS sender_display_name,
      wr.reply_to_message_id,
      rm.text AS reply_text,ru.display_name AS reply_sender_display_name,
      CASE WHEN m.sender_user_id=?2 THEN 1 ELSE 0 END AS can_edit,
      CASE WHEN m.sender_user_id=?2 OR ?3 IN ('owner','admin','moderator') THEN 1 ELSE 0 END AS can_delete,
      CASE WHEN pm.message_id IS NULL THEN 0 ELSE 1 END AS is_pinned
    FROM messages m
    LEFT JOIN users u ON u.id=m.sender_user_id
    LEFT JOIN wavero_message_replies wr ON wr.message_id=m.id
    LEFT JOIN messages rm ON rm.id=wr.reply_to_message_id
    LEFT JOIN users ru ON ru.id=rm.sender_user_id
    LEFT JOIN wavero_pinned_messages pm ON pm.chat_id=m.chat_id AND pm.message_id=m.id
    WHERE m.chat_id=?1 AND m.deleted_at IS NULL AND m.deleted_for_everyone=0
    ORDER BY m.created_at DESC LIMIT ?4
  `).bind(chatId,user.id,membership.role,limit).all();
  const messages=(result.results||[]).reverse();

  const reactionResult = await env.DB.prepare(`
    SELECT r.message_id,r.emoji,r.user_id,u.username,u.display_name
    FROM wavero_message_reactions r
    INNER JOIN messages m ON m.id=r.message_id
    LEFT JOIN users u ON u.id=r.user_id
    WHERE m.chat_id=?1 AND m.deleted_at IS NULL AND m.deleted_for_everyone=0
    ORDER BY r.created_at ASC
  `).bind(chatId).all();
  const reactionMap = new Map();
  for (const row of reactionResult.results || []) {
    if (!reactionMap.has(row.message_id)) reactionMap.set(row.message_id, []);
    reactionMap.get(row.message_id).push({ emoji: row.emoji, user_id: row.user_id, username: row.username, display_name: row.display_name, mine: row.user_id === user.id });
  }
  for (const message of messages) message.reactions = reactionMap.get(message.id) || [];

  return json({ ok:true,chat_id:chatId,role:membership.role,chat_type:membership.type,messages });
}

async function sendMessage(request, env, chatId) {
  const user = await authenticatedD1User(request, env);
  const membership = await ensureChatAccess(env, chatId, user.id);
  if (membership.type === "channel" && !canModerateChat(membership.role)) {
    throw new ApiError(403, "В этом канале публиковать могут только администраторы.", "CHANNEL_WRITE_DENIED");
  }
  const body = await readJson(request);
  const text = clean(body.text);
  const replyTo = clean(body.reply_to_message_id);
  if (!text) throw new ApiError(400, "Сообщение не может быть пустым.", "MESSAGE_EMPTY");
  if (text.length > 4000) throw new ApiError(400, "Сообщение слишком длинное.", "MESSAGE_TOO_LONG");
  if (replyTo) {
    const target = await env.DB.prepare(`SELECT id FROM messages WHERE id=?1 AND chat_id=?2 AND deleted_at IS NULL AND deleted_for_everyone=0 LIMIT 1`).bind(replyTo,chatId).first();
    if (!target) throw new ApiError(400, "Сообщение для ответа не найдено.", "REPLY_TARGET_MISSING");
  }
  const id=crypto.randomUUID(); const now=new Date().toISOString();
  const statements=[
    env.DB.prepare(`INSERT INTO messages(id,chat_id,sender_user_id,type,text,created_at) VALUES(?1,?2,?3,'text',?4,?5)`).bind(id,chatId,user.id,text,now),
    env.DB.prepare(`UPDATE chats SET updated_at=?1 WHERE id=?2`).bind(now,chatId),
  ];
  if (replyTo) statements.push(env.DB.prepare(`INSERT INTO wavero_message_replies(message_id,reply_to_message_id,created_at) VALUES(?1,?2,?3)`).bind(id,replyTo,now));
  await env.DB.batch(statements);
  return json({ok:true,message:{id,chat_id:chatId,sender_user_id:user.id,sender_username:user.username,sender_display_name:user.display_name,type:'text',text,created_at:now,edited_at:null,reply_to_message_id:replyTo||null,reactions:[],can_edit:1,can_delete:1,is_pinned:0}},201);
}

async function messageWithAccess(env, messageId, userId) {
  const row = await env.DB.prepare(`
    SELECT
      m.id,
      m.chat_id,
      m.sender_user_id,
      m.deleted_at,
      m.deleted_for_everyone,
      cm.role
    FROM messages m
    INNER JOIN chat_members cm
      ON cm.chat_id = m.chat_id
      AND cm.user_id = ?2
      AND cm.left_at IS NULL
      AND cm.is_banned = 0
    INNER JOIN chats c
      ON c.id = m.chat_id
      AND c.deleted_at IS NULL
    WHERE m.id = ?1
    LIMIT 1
  `).bind(messageId, userId).first();

  if (!row) {
    throw new ApiError(404, "Сообщение не найдено.");
  }

  return row;
}

async function editMessage(request, env, messageId) {
  const user = await authenticatedD1User(request, env);
  const message = await messageWithAccess(env, messageId, user.id);

  if (message.sender_user_id !== user.id) {
    throw new ApiError(403, "Можно изменять только свои сообщения.");
  }

  if (message.deleted_at || Number(message.deleted_for_everyone) === 1) {
    throw new ApiError(409, "Удалённое сообщение нельзя изменить.");
  }

  const body = await readJson(request);
  const text = clean(body.text);

  if (!text) {
    throw new ApiError(400, "Сообщение не может быть пустым.");
  }

  if (text.length > 4000) {
    throw new ApiError(400, "Сообщение слишком длинное.");
  }

  const editedAt = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE messages
    SET text = ?1,
        edited_at = ?2
    WHERE id = ?3
  `).bind(text, editedAt, messageId).run();

  return json({
    ok: true,
    message: {
      id: messageId,
      text,
      edited_at: editedAt,
    },
  });
}

async function deleteMessage(request, env, messageId) {
  const user = await authenticatedD1User(request, env);
  const message = await messageWithAccess(env, messageId, user.id);

  const canModerate = ["owner", "admin", "moderator"].includes(message.role);
  const isAuthor = message.sender_user_id === user.id;

  if (!isAuthor && !canModerate) {
    throw new ApiError(403, "Недостаточно прав для удаления сообщения.");
  }

  if (message.deleted_at || Number(message.deleted_for_everyone) === 1) {
    return json({ ok: true, deleted: true });
  }

  const deletedAt = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE messages
    SET deleted_for_everyone = 1,
        deleted_at = ?1
    WHERE id = ?2
  `).bind(deletedAt, messageId).run();

  return json({
    ok: true,
    deleted: true,
    message_id: messageId,
  });
}


async function loadProfile(env, user) {
  const profile = await env.DB.prepare(`
    SELECT bio,avatar_url,theme,sound_enabled,notifications_enabled,updated_at
    FROM wavero_profiles WHERE user_id=?1 LIMIT 1
  `).bind(user.id).first();
  return {
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
    theme: profile?.theme || "dark",
    sound_enabled: profile ? Number(profile.sound_enabled) : 1,
    notifications_enabled: profile ? Number(profile.notifications_enabled) : 1,
    updated_at: profile?.updated_at || null,
  };
}

async function getMyProfile(request, env) {
  const user=await authenticatedD1User(request,env);
  return json({ok:true,user,profile:await loadProfile(env,user)});
}

async function updateMyProfile(request, env) {
  const user=await authenticatedD1User(request,env);
  const body=await readJson(request);
  const displayName=clean(body.display_name || user.display_name);
  const username=clean(body.username || user.username).toLowerCase();
  const validation=validateProfile(username,displayName);
  if (validation) throw new ApiError(400,validation,"PROFILE_INVALID");
  const reserved=new Set(["admin","administrator","moderator","support","system","security","wavero"]);
  if (reserved.has(username) && username !== user.username) throw new ApiError(409,"Этот username зарезервирован.","USERNAME_RESERVED");
  const conflict=await env.DB.prepare(`SELECT id FROM users WHERE username_normalized=?1 AND id<>?2 LIMIT 1`).bind(username,user.id).first();
  if (conflict) throw new ApiError(409,"Этот username уже занят.","USERNAME_TAKEN");
  const bio=clean(body.bio).slice(0,280);
  const avatarUrl=clean(body.avatar_url).slice(0,1000);
  const theme=["dark","light","system"].includes(body.theme)?body.theme:"dark";
  const soundEnabled=body.sound_enabled===false||body.sound_enabled===0?0:1;
  const notificationsEnabled=body.notifications_enabled===false||body.notifications_enabled===0?0:1;
  const now=new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(`UPDATE users SET username=?1,username_normalized=?1,display_name=?2,updated_at=?3 WHERE id=?4`).bind(username,displayName,now,user.id),
    env.DB.prepare(`INSERT INTO wavero_profiles(user_id,bio,avatar_url,theme,sound_enabled,notifications_enabled,updated_at)
      VALUES(?1,?2,?3,?4,?5,?6,?7)
      ON CONFLICT(user_id) DO UPDATE SET bio=excluded.bio,avatar_url=excluded.avatar_url,theme=excluded.theme,sound_enabled=excluded.sound_enabled,notifications_enabled=excluded.notifications_enabled,updated_at=excluded.updated_at`)
      .bind(user.id,bio,avatarUrl,theme,soundEnabled,notificationsEnabled,now),
  ]);
  const updated={...user,username,display_name:displayName};
  return json({ok:true,user:updated,profile:await loadProfile(env,updated)});
}

async function listBlocks(request, env) {
  const user=await authenticatedD1User(request,env);
  const result=await env.DB.prepare(`SELECT u.id,u.username,u.display_name,b.created_at FROM wavero_blocks_v1 b INNER JOIN users u ON u.id=b.blocked_user_id WHERE b.blocker_user_id=?1 ORDER BY b.created_at DESC`).bind(user.id).all();
  return json({ok:true,users:result.results||[]});
}
async function blockUser(request, env, targetId) {
  const user=await authenticatedD1User(request,env);
  if (targetId===user.id) throw new ApiError(400,"Нельзя заблокировать себя.","BLOCK_SELF");
  const target=await env.DB.prepare(`SELECT id FROM users WHERE id=?1 AND status<>'deleted' LIMIT 1`).bind(targetId).first();
  if (!target) throw new ApiError(404,"Пользователь не найден.","USER_NOT_FOUND");
  await env.DB.prepare(`INSERT OR IGNORE INTO wavero_blocks_v1(blocker_user_id,blocked_user_id,created_at) VALUES(?1,?2,?3)`).bind(user.id,targetId,new Date().toISOString()).run();
  return json({ok:true,blocked:true});
}
async function unblockUser(request, env, targetId) {
  const user=await authenticatedD1User(request,env);
  await env.DB.prepare(`DELETE FROM wavero_blocks_v1 WHERE blocker_user_id=?1 AND blocked_user_id=?2`).bind(user.id,targetId).run();
  return json({ok:true,blocked:false});
}

async function createChat(request, env) {
  const user=await authenticatedD1User(request,env);
  const body=await readJson(request);
  const type=body.type === "channel" ? "channel" : "group";
  const title=clean(body.title);
  const description=clean(body.description).slice(0,500);
  const isPublic=body.is_public?1:0;
  const username=clean(body.username).toLowerCase().replace(/^@+/,"");
  if (title.length<2||title.length>80) throw new ApiError(400,"Название должно содержать от 2 до 80 символов.","CHAT_TITLE_INVALID");
  if (username && !/^[a-z0-9_]{4,32}$/.test(username)) throw new ApiError(400,"Username чата: 4–32 символа, латинские буквы, цифры и _.","CHAT_USERNAME_INVALID");
  if (isPublic && !username) throw new ApiError(400,"Для публичного чата нужен username.","CHAT_USERNAME_REQUIRED");
  if (username) {
    const conflict=await env.DB.prepare(`SELECT id FROM chats WHERE username_normalized=?1 AND deleted_at IS NULL LIMIT 1`).bind(username).first();
    if (conflict) throw new ApiError(409,"Этот username чата уже занят.","CHAT_USERNAME_TAKEN");
  }
  const chatId=crypto.randomUUID(); const now=new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO chats(id,type,title,username,username_normalized,description,owner_user_id,is_system,is_public,created_at,updated_at)
      VALUES(?1,?2,?3,?4,?4,?5,?6,0,?7,?8,?8)`).bind(chatId,type,title,username||null,description,user.id,isPublic,now),
    env.DB.prepare(`INSERT INTO chat_members(chat_id,user_id,role,joined_at) VALUES(?1,?2,'owner',?3)`).bind(chatId,user.id,now),
  ]);
  return json({ok:true,chat_id:chatId,created:true},201);
}

async function getChat(request, env, chatId) {
  const user=await authenticatedD1User(request,env);
  const membership=await ensureChatAccess(env,chatId,user.id);
  const [members,pins] = await Promise.all([queryChatMembers(env,chatId), env.DB.prepare(`SELECT pm.message_id,pm.pinned_at,m.text,u.display_name AS sender_display_name FROM wavero_pinned_messages pm INNER JOIN messages m ON m.id=pm.message_id LEFT JOIN users u ON u.id=m.sender_user_id WHERE pm.chat_id=?1 ORDER BY pm.pinned_at DESC LIMIT 20`).bind(chatId).all()]);
  return json({ok:true,chat:membership,members,pins:pins.results||[]});
}

async function updateChat(request, env, chatId) {
  const user=await authenticatedD1User(request,env);
  const membership=await ensureChatAccess(env,chatId,user.id);
  if (!canManageChat(membership.role)) throw new ApiError(403,"Недостаточно прав.","CHAT_MANAGE_DENIED");
  if (membership.type==='private') throw new ApiError(400,"Личный диалог нельзя изменить таким способом.","PRIVATE_CHAT_IMMUTABLE");
  const body=await readJson(request);
  const title=clean(body.title || membership.title);
  const description=clean(body.description ?? membership.description).slice(0,500);
  const username=clean(body.username ?? membership.username).toLowerCase().replace(/^@+/,"");
  const isPublic=body.is_public===undefined?Number(membership.is_public):(body.is_public?1:0);
  if (title.length<2||title.length>80) throw new ApiError(400,"Название должно содержать от 2 до 80 символов.","CHAT_TITLE_INVALID");
  if (username && !/^[a-z0-9_]{4,32}$/.test(username)) throw new ApiError(400,"Некорректный username чата.","CHAT_USERNAME_INVALID");
  if (isPublic && !username) throw new ApiError(400,"Для публичного чата нужен username.","CHAT_USERNAME_REQUIRED");
  if (username) {
    const conflict=await env.DB.prepare(`SELECT id FROM chats WHERE username_normalized=?1 AND id<>?2 AND deleted_at IS NULL LIMIT 1`).bind(username,chatId).first();
    if (conflict) throw new ApiError(409,"Этот username чата уже занят.","CHAT_USERNAME_TAKEN");
  }
  await env.DB.prepare(`UPDATE chats SET title=?1,description=?2,username=?3,username_normalized=?3,is_public=?4,updated_at=?5 WHERE id=?6`).bind(title,description,username||null,isPublic,new Date().toISOString(),chatId).run();
  return json({ok:true,updated:true});
}

async function deleteOrLeaveChat(request, env, chatId) {
  const user=await authenticatedD1User(request,env);
  const membership=await ensureChatAccess(env,chatId,user.id);
  const body=await readJson(request,true);
  const now=new Date().toISOString();
  if (body.delete_for_everyone) {
    if (membership.role!=="owner" && !isGlobalAdmin(user)) throw new ApiError(403,"Удалить чат может только владелец.","CHAT_DELETE_DENIED");
    await env.DB.prepare(`UPDATE chats SET deleted_at=?1,updated_at=?1 WHERE id=?2`).bind(now,chatId).run();
    await logAdminAction(env,user,"delete_chat","chat",chatId,"");
    return json({ok:true,deleted:true});
  }
  if (membership.type==='private') throw new ApiError(400,"Личный диалог пока нельзя покинуть.","PRIVATE_LEAVE_DENIED");
  if (membership.role==='owner') throw new ApiError(409,"Сначала передайте права владельца или удалите чат.","OWNER_CANNOT_LEAVE");
  await env.DB.prepare(`UPDATE chat_members SET left_at=?1 WHERE chat_id=?2 AND user_id=?3`).bind(now,chatId,user.id).run();
  return json({ok:true,left:true});
}

async function queryChatMembers(env, chatId) {
  const result=await env.DB.prepare(`SELECT u.id,u.username,u.display_name,u.role AS global_role,u.status,cm.role,cm.joined_at,cm.is_banned FROM chat_members cm INNER JOIN users u ON u.id=cm.user_id WHERE cm.chat_id=?1 AND cm.left_at IS NULL ORDER BY CASE cm.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 WHEN 'moderator' THEN 2 ELSE 3 END,u.display_name`).bind(chatId).all();
  return result.results||[];
}
async function listChatMembers(request, env, chatId) {
  const user=await authenticatedD1User(request,env); await ensureChatAccess(env,chatId,user.id);
  return json({ok:true,members:await queryChatMembers(env,chatId)});
}
async function addChatMember(request, env, chatId) {
  const user=await authenticatedD1User(request,env); const membership=await ensureChatAccess(env,chatId,user.id);
  if (!canManageChat(membership.role)) throw new ApiError(403,"Недостаточно прав.","MEMBER_ADD_DENIED");
  const body=await readJson(request); const targetId=clean(body.user_id); const targetUsername=clean(body.username).toLowerCase();
  const target=targetId?await env.DB.prepare(`SELECT id FROM users WHERE id=?1 AND status='active' LIMIT 1`).bind(targetId).first():await env.DB.prepare(`SELECT id FROM users WHERE username_normalized=?1 AND status='active' LIMIT 1`).bind(targetUsername).first();
  if (!target) throw new ApiError(404,"Пользователь не найден.","USER_NOT_FOUND");
  const role=membership.type==='channel'?'subscriber':'member'; const now=new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(`UPDATE chat_members SET role=?1,left_at=NULL,is_banned=0,joined_at=?2 WHERE chat_id=?3 AND user_id=?4`).bind(role,now,chatId,target.id),
    env.DB.prepare(`INSERT OR IGNORE INTO chat_members(chat_id,user_id,role,joined_at) VALUES(?1,?2,?3,?4)`).bind(chatId,target.id,role,now),
  ]);
  return json({ok:true,added:true});
}
async function updateChatMember(request, env, chatId, targetId) {
  const user=await authenticatedD1User(request,env); const membership=await ensureChatAccess(env,chatId,user.id);
  if (!canManageChat(membership.role)) throw new ApiError(403,"Недостаточно прав.","MEMBER_ROLE_DENIED");
  const target=await env.DB.prepare(`SELECT role FROM chat_members WHERE chat_id=?1 AND user_id=?2 AND left_at IS NULL LIMIT 1`).bind(chatId,targetId).first();
  if (!target) throw new ApiError(404,"Участник не найден.","MEMBER_NOT_FOUND");
  if (target.role==='owner' && membership.role!=='owner') throw new ApiError(403,"Нельзя изменить владельца.","OWNER_PROTECTED");
  const body=await readJson(request); const allowed=membership.type==='channel'?['admin','moderator','subscriber']:['admin','moderator','member'];
  const role=clean(body.role); if (!allowed.includes(role)) throw new ApiError(400,"Недопустимая роль.","ROLE_INVALID");
  if (role==='admin' && membership.role!=='owner') throw new ApiError(403,"Назначать администраторов может только владелец.","ADMIN_ASSIGN_DENIED");
  await env.DB.prepare(`UPDATE chat_members SET role=?1 WHERE chat_id=?2 AND user_id=?3`).bind(role,chatId,targetId).run();
  return json({ok:true,updated:true});
}
async function removeChatMember(request, env, chatId, targetId) {
  const user=await authenticatedD1User(request,env); const membership=await ensureChatAccess(env,chatId,user.id);
  if (!canManageChat(membership.role)) throw new ApiError(403,"Недостаточно прав.","MEMBER_REMOVE_DENIED");
  const target=await env.DB.prepare(`SELECT role FROM chat_members WHERE chat_id=?1 AND user_id=?2 AND left_at IS NULL LIMIT 1`).bind(chatId,targetId).first();
  if (!target) throw new ApiError(404,"Участник не найден.","MEMBER_NOT_FOUND");
  if (target.role==='owner') throw new ApiError(403,"Владельца нельзя удалить.","OWNER_PROTECTED");
  await env.DB.prepare(`UPDATE chat_members SET left_at=?1 WHERE chat_id=?2 AND user_id=?3`).bind(new Date().toISOString(),chatId,targetId).run();
  return json({ok:true,removed:true});
}

async function searchMessages(request, env, chatId, url) {
  const user=await authenticatedD1User(request,env); await ensureChatAccess(env,chatId,user.id);
  const q=clean(url.searchParams.get('q')).slice(0,100); if (q.length<2) return json({ok:true,messages:[]});
  const result=await env.DB.prepare(`SELECT m.id,m.text,m.created_at,u.display_name AS sender_display_name,u.username AS sender_username FROM messages m LEFT JOIN users u ON u.id=m.sender_user_id WHERE m.chat_id=?1 AND m.deleted_at IS NULL AND m.deleted_for_everyone=0 AND LOWER(m.text) LIKE ?2 ESCAPE '\\' ORDER BY m.created_at DESC LIMIT 50`).bind(chatId,`%${escapeLike(q.toLowerCase())}%`).all();
  return json({ok:true,messages:result.results||[]});
}
async function markChatRead(request, env, chatId) {
  const user=await authenticatedD1User(request,env); await ensureChatAccess(env,chatId,user.id); const now=new Date().toISOString();
  await env.DB.prepare(`INSERT INTO wavero_chat_state(chat_id,user_id,last_read_at,updated_at) VALUES(?1,?2,?3,?3) ON CONFLICT(chat_id,user_id) DO UPDATE SET last_read_at=excluded.last_read_at,updated_at=excluded.updated_at`).bind(chatId,user.id,now).run();
  return json({ok:true,read_at:now});
}

async function setReaction(request, env, messageId) {
  const user=await authenticatedD1User(request,env); await messageWithAccess(env,messageId,user.id); const body=await readJson(request); const emoji=clean(body.emoji);
  const allowed=['👍','❤️','😂','😮','😢','🔥','🎉']; if (!allowed.includes(emoji)) throw new ApiError(400,"Недопустимая реакция.","REACTION_INVALID");
  await env.DB.prepare(`INSERT OR IGNORE INTO wavero_message_reactions(message_id,user_id,emoji,created_at) VALUES(?1,?2,?3,?4)`).bind(messageId,user.id,emoji,new Date().toISOString()).run();
  return json({ok:true,reacted:true});
}
async function removeReaction(request, env, messageId) {
  const user=await authenticatedD1User(request,env); await messageWithAccess(env,messageId,user.id); const body=await readJson(request,true); const emoji=clean(body.emoji);
  if (emoji) await env.DB.prepare(`DELETE FROM wavero_message_reactions WHERE message_id=?1 AND user_id=?2 AND emoji=?3`).bind(messageId,user.id,emoji).run();
  else await env.DB.prepare(`DELETE FROM wavero_message_reactions WHERE message_id=?1 AND user_id=?2`).bind(messageId,user.id).run();
  return json({ok:true,reacted:false});
}
async function pinMessage(request, env, messageId) {
  const user=await authenticatedD1User(request,env); const message=await messageWithAccess(env,messageId,user.id);
  if (!canModerateChat(message.role)) throw new ApiError(403,"Закреплять сообщения могут администраторы.","PIN_DENIED");
  await env.DB.prepare(`INSERT OR IGNORE INTO wavero_pinned_messages(chat_id,message_id,pinned_by_user_id,pinned_at) VALUES(?1,?2,?3,?4)`).bind(message.chat_id,messageId,user.id,new Date().toISOString()).run();
  return json({ok:true,pinned:true});
}
async function unpinMessage(request, env, messageId) {
  const user=await authenticatedD1User(request,env); const message=await messageWithAccess(env,messageId,user.id);
  if (!canModerateChat(message.role)) throw new ApiError(403,"Откреплять сообщения могут администраторы.","PIN_DENIED");
  await env.DB.prepare(`DELETE FROM wavero_pinned_messages WHERE chat_id=?1 AND message_id=?2`).bind(message.chat_id,messageId).run();
  return json({ok:true,pinned:false});
}

async function createInvite(request, env, chatId) {
  const user=await authenticatedD1User(request,env); const membership=await ensureChatAccess(env,chatId,user.id);
  if (!canManageChat(membership.role) || membership.type==='private') throw new ApiError(403,"Недостаточно прав для создания ссылки.","INVITE_DENIED");
  const body=await readJson(request,true); const hours=Math.max(1,Math.min(720,Number(body.expires_in_hours||168))); const maxUses=body.max_uses?Math.max(1,Math.min(10000,Number(body.max_uses))):null;
  const id=crypto.randomUUID(); const code=randomCode(24); const now=new Date(); const expiresAt=new Date(now.getTime()+hours*3600000).toISOString();
  await env.DB.prepare(`INSERT INTO wavero_invites(id,chat_id,code,created_by_user_id,expires_at,max_uses,created_at) VALUES(?1,?2,?3,?4,?5,?6,?7)`).bind(id,chatId,code,user.id,expiresAt,maxUses,now.toISOString()).run();
  return json({ok:true,invite:{code,url:`${new URL(request.url).origin}/?invite=${code}`,expires_at:expiresAt,max_uses:maxUses}},201);
}
async function joinInvite(request, env, code) {
  const user=await authenticatedD1User(request,env); const invite=await env.DB.prepare(`SELECT i.*,c.type,c.deleted_at FROM wavero_invites i INNER JOIN chats c ON c.id=i.chat_id WHERE i.code=?1 AND i.is_active=1 LIMIT 1`).bind(code).first();
  if (!invite||invite.deleted_at) throw new ApiError(404,"Ссылка недействительна.","INVITE_INVALID");
  const now=new Date(); if (invite.expires_at && new Date(invite.expires_at)<=now) throw new ApiError(410,"Срок действия ссылки истёк.","INVITE_EXPIRED");
  if (invite.max_uses && Number(invite.use_count)>=Number(invite.max_uses)) throw new ApiError(410,"Лимит использований ссылки исчерпан.","INVITE_LIMIT");
  const role=invite.type==='channel'?'subscriber':'member'; const iso=now.toISOString();
  await env.DB.batch([
    env.DB.prepare(`UPDATE chat_members SET role=?1,left_at=NULL,is_banned=0,joined_at=?2 WHERE chat_id=?3 AND user_id=?4`).bind(role,iso,invite.chat_id,user.id),
    env.DB.prepare(`INSERT OR IGNORE INTO chat_members(chat_id,user_id,role,joined_at) VALUES(?1,?2,?3,?4)`).bind(invite.chat_id,user.id,role,iso),
    env.DB.prepare(`UPDATE wavero_invites SET use_count=use_count+1 WHERE id=?1`).bind(invite.id),
  ]);
  return json({ok:true,chat_id:invite.chat_id});
}

async function createReport(request, env) {
  const user=await authenticatedD1User(request,env); const body=await readJson(request); const targetType=clean(body.target_type); const targetId=clean(body.target_id); const reason=clean(body.reason); const details=clean(body.details).slice(0,1000);
  if (!['user','chat','message'].includes(targetType)||!targetId||reason.length<3) throw new ApiError(400,"Заполните данные жалобы.","REPORT_INVALID");
  const id=crypto.randomUUID(); const now=new Date().toISOString(); await env.DB.prepare(`INSERT INTO wavero_reports_v1(id,reporter_user_id,target_type,target_id,reason,details,created_at,updated_at) VALUES(?1,?2,?3,?4,?5,?6,?7,?7)`).bind(id,user.id,targetType,targetId,reason,details,now).run();
  return json({ok:true,report_id:id},201);
}

function isGlobalAdmin(user){return ['owner','admin'].includes(user?.role)}
function canManageChat(role){return ['owner','admin'].includes(role)}
function canModerateChat(role){return ['owner','admin','moderator'].includes(role)}
async function requireGlobalAdmin(request,env){const user=await authenticatedD1User(request,env); if(!isGlobalAdmin(user)) throw new ApiError(403,"Доступ только для администрации.","ADMIN_REQUIRED"); return user}
async function adminOverview(request, env, url) {
  const admin=await requireGlobalAdmin(request,env); const q=clean(url.searchParams.get('q')).toLowerCase();
  const [userCount,chatCount,messageCount,openCount,users,reports]=await Promise.all([
    env.DB.prepare(`SELECT COUNT(*) AS count FROM users WHERE status<>'deleted'`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS count FROM chats WHERE deleted_at IS NULL`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS count FROM messages WHERE deleted_at IS NULL AND deleted_for_everyone=0`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS count FROM wavero_reports_v1 WHERE status IN ('open','reviewing')`).first(),
    env.DB.prepare(`SELECT id,username,display_name,email,role,status,created_at,last_seen_at FROM users WHERE (?1='' OR LOWER(username) LIKE ?2 OR LOWER(display_name) LIKE ?2 OR LOWER(email) LIKE ?2) ORDER BY created_at DESC LIMIT 80`).bind(q,`%${escapeLike(q)}%`).all(),
    env.DB.prepare(`SELECT r.*,reporter.username AS reporter_username,handler.username AS handler_username FROM wavero_reports_v1 r LEFT JOIN users reporter ON reporter.id=r.reporter_user_id LEFT JOIN users handler ON handler.id=r.handled_by_user_id ORDER BY CASE r.status WHEN 'open' THEN 0 WHEN 'reviewing' THEN 1 ELSE 2 END,r.created_at DESC LIMIT 100`).all(),
  ]);
  return json({ok:true,admin,stats:{users:Number(userCount?.count||0),chats:Number(chatCount?.count||0),messages:Number(messageCount?.count||0),open_reports:Number(openCount?.count||0)},users:users.results||[],reports:reports.results||[]});
}
async function adminUpdateUser(request, env, targetId) {
  const admin=await requireGlobalAdmin(request,env); const body=await readJson(request); const target=await env.DB.prepare(`SELECT id,role,status FROM users WHERE id=?1 LIMIT 1`).bind(targetId).first(); if(!target) throw new ApiError(404,"Пользователь не найден.","USER_NOT_FOUND");
  let status=clean(body.status||target.status); if(!['active','suspended','deleted','pending_verification'].includes(status)) throw new ApiError(400,"Недопустимый статус.","STATUS_INVALID");
  let role=clean(body.role||target.role); if(!['user','moderator','admin','owner'].includes(role)) throw new ApiError(400,"Недопустимая роль.","ROLE_INVALID");
  if ((target.role==='owner'||role==='owner') && admin.role!=='owner') throw new ApiError(403,"Только владелец может управлять владельцами.","OWNER_ADMIN_ONLY");
  if (targetId===admin.id && status!=='active') throw new ApiError(400,"Нельзя заблокировать собственный аккаунт.","ADMIN_SELF_SUSPEND");
  await env.DB.prepare(`UPDATE users SET status=?1,role=?2,updated_at=?3 WHERE id=?4`).bind(status,role,new Date().toISOString(),targetId).run();
  await logAdminAction(env,admin,'update_user','user',targetId,JSON.stringify({status,role})); return json({ok:true,updated:true});
}
async function adminUpdateReport(request, env, reportId) {
  const admin=await requireGlobalAdmin(request,env); const body=await readJson(request); const status=clean(body.status); if(!['open','reviewing','resolved','rejected'].includes(status)) throw new ApiError(400,"Недопустимый статус жалобы.","REPORT_STATUS_INVALID"); const resolution=clean(body.resolution).slice(0,1000); const now=new Date().toISOString();
  const result=await env.DB.prepare(`UPDATE wavero_reports_v1 SET status=?1,resolution=?2,handled_by_user_id=?3,updated_at=?4 WHERE id=?5`).bind(status,resolution,admin.id,now,reportId).run(); if(!result.meta?.changes) throw new ApiError(404,"Жалоба не найдена.","REPORT_NOT_FOUND"); await logAdminAction(env,admin,'update_report','report',reportId,JSON.stringify({status,resolution})); return json({ok:true,updated:true});
}
async function logAdminAction(env,admin,action,targetType,targetId,details){await env.DB.prepare(`INSERT INTO wavero_admin_actions(id,admin_user_id,action,target_type,target_id,details,created_at) VALUES(?1,?2,?3,?4,?5,?6,?7)`).bind(crypto.randomUUID(),admin.id,action,targetType,targetId,details||'',new Date().toISOString()).run()}
function randomCode(length=24){const bytes=new Uint8Array(length);crypto.getRandomValues(bytes);return Array.from(bytes,b=>"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"[b%57]).join("")}

async function sendVerification(env, idToken) {
  return firebaseRequest(env, "accounts:sendOobCode", {
    requestType: "VERIFY_EMAIL",
    idToken,
  });
}

async function lookupFirebaseUser(env, idToken) {
  const data = await firebaseRequest(env, "accounts:lookup", { idToken });
  const user = data.users?.[0];
  if (!user) throw new ApiError(401, "Недействительная сессия.");
  return user;
}

async function firebaseRequest(env, endpoint, payload) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Firebase-Locale": "ru",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const code = data?.error?.message || "FIREBASE_ERROR";
    throw new ApiError(mapFirebaseStatus(code), firebaseMessage(code));
  }
  return data;
}

function requireFirebase(env) {
  if (!env.FIREBASE_API_KEY || !env.FIREBASE_PROJECT_ID) {
    throw new ApiError(500, "Сервер авторизации не настроен.");
  }
}

function bearerToken(request) {
  const value = request.headers.get("Authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

async function readJson(request, optional = false) {
  try {
    return await request.json();
  } catch {
    if (optional) return {};
    throw new ApiError(400, "Некорректный запрос.");
  }
}

function validateRegistration(email, password, username, displayName) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Укажите корректный email.";
  if (password.length < 8 || password.length > 128) {
    return "Пароль должен содержать от 8 до 128 символов.";
  }
  if (!/\d/.test(password)) {
    return "Пароль должен содержать хотя бы одну цифру.";
  }
  return validateProfile(username, displayName);
}

function validateProfile(username, displayName) {
  if (!/^[a-z0-9_]{4,24}$/.test(username)) {
    return "Username: 4–24 символа, латинские буквы, цифры и знак _.";
  }
  if (displayName.length < 1 || displayName.length > 50) {
    return "Имя должно содержать от 1 до 50 символов.";
  }
  return null;
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function firebaseMessage(code) {
  const messages = {
    EMAIL_EXISTS: "Этот email уже зарегистрирован.",
    INVALID_EMAIL: "Некорректный email.",
    WEAK_PASSWORD: "Пароль слишком простой.",
    EMAIL_NOT_FOUND: "Неверный email или пароль.",
    INVALID_PASSWORD: "Неверный email или пароль.",
    INVALID_LOGIN_CREDENTIALS: "Неверный email или пароль.",
    USER_DISABLED: "Аккаунт заблокирован.",
    TOO_MANY_ATTEMPTS_TRY_LATER: "Слишком много попыток. Попробуйте позже.",
    OPERATION_NOT_ALLOWED: "Вход по email и паролю не включён.",
    API_KEY_INVALID: "Ключ Firebase в настройках сервера недействителен.",
  };
  return messages[code] || "Ошибка авторизации.";
}

function mapFirebaseStatus(code) {
  if (["EMAIL_EXISTS"].includes(code)) return 409;
  if (["EMAIL_NOT_FOUND", "INVALID_PASSWORD", "INVALID_LOGIN_CREDENTIALS"].includes(code)) return 401;
  if (["USER_DISABLED"].includes(code)) return 403;
  if (["TOO_MANY_ATTEMPTS_TRY_LATER"].includes(code)) return 429;
  if (["API_KEY_INVALID"].includes(code)) return 500;
  return 400;
}

class ApiError extends Error {
  constructor(status, message, code = "API_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function renderIndexHtml(template, env) {
  const apiKey = String(env.FIREBASE_API_KEY || "").trim();
  const projectId = String(env.FIREBASE_PROJECT_ID || "").trim();

  if (!apiKey || !projectId) {
    throw new ApiError(500, "Firebase не настроен на сервере.");
  }

  const authDomain = `${projectId}.firebaseapp.com`;

  return template
    .replace("__FIREBASE_API_KEY_JSON__", JSON.stringify(apiKey))
    .replace("__FIREBASE_AUTH_DOMAIN_JSON__", JSON.stringify(authDomain))
    .replace("__FIREBASE_PROJECT_ID_JSON__", JSON.stringify(projectId));
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: JSON_HEADERS,
  });
}
