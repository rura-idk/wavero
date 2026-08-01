const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    try {
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/health") {
        return json({
          ok: true,
          service: "wavero-api",
          version: "0.6.1",
          firebaseConfigured: Boolean(env.FIREBASE_API_KEY && env.FIREBASE_PROJECT_ID),
          databaseConfigured: Boolean(env.DB),
        });
      }

      if (request.method === "POST" && url.pathname === "/api/auth/register") {
        return register(request, env);
      }

      if (request.method === "POST" && url.pathname === "/api/auth/login") {
        return login(request, env);
      }

      if (request.method === "POST" && url.pathname === "/api/auth/refresh") {
        return refreshSession(request, env);
      }

      if (request.method === "POST" && url.pathname === "/api/auth/resend-verification") {
        return resendVerification(request, env);
      }

      if (request.method === "POST" && url.pathname === "/api/auth/reset-password") {
        return resetPassword(request, env);
      }

      if (request.method === "POST" && url.pathname === "/api/auth/sync") {
        return syncAuthenticatedUser(request, env);
      }

      if (request.method === "GET" && url.pathname === "/api/me/chats") {
        return listMyChats(request, env);
      }

      // Public directory lookup uses a simple GET request without Authorization.
      // This deliberately avoids cross-origin preflight failures in mobile browsers.
      if (request.method === "GET" && url.pathname === "/directory") {
        return searchDirectory(request, env, url);
      }

      // Keep an authenticated alias for future native clients.
      if (
        (request.method === "GET" || request.method === "POST") &&
        url.pathname === "/api/directory"
      ) {
        return searchDirectory(request, env, url);
      }

      if (request.method === "POST" && url.pathname === "/api/chats/direct") {
        return createOrOpenDirectChat(request, env);
      }

      const messagesMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/messages$/);
      if (messagesMatch && request.method === "GET") {
        return listMessages(request, env, decodeURIComponent(messagesMatch[1]), url);
      }

      if (messagesMatch && request.method === "POST") {
        return sendMessage(request, env, decodeURIComponent(messagesMatch[1]));
      }

      const messageMatch = url.pathname.match(/^\/api\/messages\/([^/]+)$/);
      if (messageMatch && request.method === "PATCH") {
        return editMessage(request, env, decodeURIComponent(messageMatch[1]));
      }

      if (messageMatch && request.method === "DELETE") {
        return deleteMessage(request, env, decodeURIComponent(messageMatch[1]));
      }

      return json({ ok: false, error: "Маршрут не найден." }, 404);
    } catch (error) {
      console.error("Unhandled error", error);

      if (error instanceof ApiError) {
        return json({
          ok: false,
          error: error.message,
        }, error.status);
      }

      return json({
        ok: false,
        error: "Внутренняя ошибка сервера.",
      }, 500);
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
  const idToken = bearerToken(request);
  if (!idToken) throw new ApiError(401, "Требуется авторизация.");

  const account = await lookupFirebaseUser(env, idToken);
  if (!account.emailVerified) throw new ApiError(403, "Сначала подтвердите email.");

  const user = await env.DB.prepare(`
    SELECT id, firebase_uid, email, username, display_name, role, status
    FROM users
    WHERE firebase_uid = ?1
    LIMIT 1
  `).bind(account.localId).first();

  if (!user || user.status !== "active") {
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

  const result = await env.DB.prepare(`
    SELECT
      id,
      username,
      display_name
    FROM users
    WHERE COALESCE(status, 'active') = 'active'
      AND username IS NOT NULL
      AND username <> ''
      AND (
        LOWER(COALESCE(username_normalized, username)) LIKE ?1 ESCAPE '\\'
        OR LOWER(COALESCE(display_name, '')) LIKE ?1 ESCAPE '\\'
      )
    ORDER BY
      CASE
        WHEN LOWER(COALESCE(username_normalized, username)) = ?2 THEN 0
        WHEN LOWER(COALESCE(username_normalized, username)) LIKE ?2 || '%' THEN 1
        ELSE 2
      END,
      LOWER(COALESCE(username_normalized, username)) ASC
    LIMIT 20
  `).bind(pattern, exact).all();

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
  const targetUsername = clean(body.username).toLowerCase();

  if (!targetUsername) {
    throw new ApiError(400, "Не указан пользователь.");
  }

  const target = await env.DB.prepare(`
    SELECT id, username, display_name
    FROM users
    WHERE username_normalized = ?1
      AND status = 'active'
    LIMIT 1
  `).bind(targetUsername).first();

  if (!target) {
    throw new ApiError(404, "Пользователь не найден.");
  }

  if (target.id === currentUser.id) {
    throw new ApiError(400, "Нельзя создать диалог с самим собой.");
  }

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
    WHERE c.type = 'direct'
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
        'direct',
        NULL,
        NULL,
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
  }, 201);
}

async function listMyChats(request, env) {
  const user = await authenticatedD1User(request, env);

  const result = await env.DB.prepare(`
    SELECT
      c.id,
      c.type,
      CASE
        WHEN c.type = 'direct' THEN (
          SELECT other_user.display_name
          FROM chat_members other_member
          INNER JOIN users other_user ON other_user.id = other_member.user_id
          WHERE other_member.chat_id = c.id
            AND other_member.user_id <> ?1
            AND other_member.left_at IS NULL
          LIMIT 1
        )
        ELSE c.title
      END AS title,
      CASE
        WHEN c.type = 'direct' THEN (
          SELECT other_user.username
          FROM chat_members other_member
          INNER JOIN users other_user ON other_user.id = other_member.user_id
          WHERE other_member.chat_id = c.id
            AND other_member.user_id <> ?1
            AND other_member.left_at IS NULL
          LIMIT 1
        )
        ELSE c.username
      END AS username,
      c.description,
      c.is_public,
      c.is_system,
      cm.role,
      (
        SELECT m.text
        FROM messages m
        WHERE m.chat_id = c.id
          AND m.deleted_at IS NULL
          AND m.deleted_for_everyone = 0
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS last_message,
      (
        SELECT m.created_at
        FROM messages m
        WHERE m.chat_id = c.id
          AND m.deleted_at IS NULL
          AND m.deleted_for_everyone = 0
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS last_message_at
    FROM chat_members cm
    INNER JOIN chats c ON c.id = cm.chat_id
    WHERE cm.user_id = ?1
      AND cm.left_at IS NULL
      AND cm.is_banned = 0
      AND c.deleted_at IS NULL
    ORDER BY COALESCE(last_message_at, c.updated_at, c.created_at) DESC
  `).bind(user.id).all();

  return json({
    ok: true,
    user,
    chats: result.results || [],
  });
}

async function ensureChatAccess(env, chatId, userId) {
  const membership = await env.DB.prepare(`
    SELECT cm.role, c.type, c.title, c.is_system, c.id AS chat_id
    FROM chat_members cm
    INNER JOIN chats c ON c.id = cm.chat_id
    WHERE cm.chat_id = ?1
      AND cm.user_id = ?2
      AND cm.left_at IS NULL
      AND cm.is_banned = 0
      AND c.deleted_at IS NULL
    LIMIT 1
  `).bind(chatId, userId).first();

  if (!membership) throw new ApiError(403, "Нет доступа к чату.");
  return membership;
}

async function listMessages(request, env, chatId, url) {
  const user = await authenticatedD1User(request, env);
  const membership = await ensureChatAccess(env, chatId, user.id);

  const limitRaw = Number.parseInt(url.searchParams.get("limit") || "50", 10);
  const limit = Math.max(1, Math.min(100, Number.isFinite(limitRaw) ? limitRaw : 50));

  const result = await env.DB.prepare(`
    SELECT
      m.id,
      m.chat_id,
      m.sender_user_id,
      m.type,
      m.text,
      m.created_at,
      m.edited_at,
      u.username AS sender_username,
      u.display_name AS sender_display_name,
      CASE
        WHEN m.sender_user_id = ?2 THEN 1
        ELSE 0
      END AS can_edit,
      CASE
        WHEN m.sender_user_id = ?2
          OR ?3 IN ('owner', 'admin', 'moderator')
        THEN 1
        ELSE 0
      END AS can_delete
    FROM messages m
    LEFT JOIN users u ON u.id = m.sender_user_id
    WHERE m.chat_id = ?1
      AND m.deleted_at IS NULL
      AND m.deleted_for_everyone = 0
    ORDER BY m.created_at DESC
    LIMIT ?4
  `).bind(chatId, user.id, membership.role, limit).all();

  const messages = (result.results || []).reverse();

  return json({
    ok: true,
    chat_id: chatId,
    messages,
  });
}

async function sendMessage(request, env, chatId) {
  const user = await authenticatedD1User(request, env);
  const membership = await ensureChatAccess(env, chatId, user.id);

  if (
    membership.type === "channel" &&
    !["owner", "admin", "moderator"].includes(membership.role)
  ) {
    throw new ApiError(403, "В этом канале публиковать могут только администраторы.");
  }

  const body = await readJson(request);
  const text = clean(body.text);

  if (!text) throw new ApiError(400, "Сообщение не может быть пустым.");
  if (text.length > 4000) throw new ApiError(400, "Сообщение слишком длинное.");

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO messages (
        id, chat_id, sender_user_id, type, text, created_at
      ) VALUES (?1, ?2, ?3, 'text', ?4, ?5)
    `).bind(id, chatId, user.id, text, now),

    env.DB.prepare(`
      UPDATE chats
      SET updated_at = ?1
      WHERE id = ?2
    `).bind(now, chatId),
  ]);

  return json({
    ok: true,
    message: {
      id,
      chat_id: chatId,
      sender_user_id: user.id,
      sender_username: user.username,
      sender_display_name: user.display_name,
      type: "text",
      text,
      created_at: now,
      edited_at: null,
      can_edit: 1,
      can_delete: 1,
    },
  }, 201);
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
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: JSON_HEADERS,
  });
}
