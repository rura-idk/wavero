const indexHtml = "<!doctype html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1\">\n  <meta name=\"color-scheme\" content=\"dark light\">\n  <meta name=\"theme-color\" content=\"#050505\">\n  <meta name=\"wavero-build\" content=\"1.0.6-embedded-ui\">\n  <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\">\n  <title>Wavero</title>\n  <style>\n    :root{\n      --bg:#050505;--panel:#0c0c0c;--panel-2:#121212;--panel-3:#181818;--line:#292929;\n      --text:#f7f7f5;--muted:#8d8d88;--soft:#c8c8c3;--accent:#fff;--accent-text:#050505;\n      --danger:#ff6c6c;--success:#77d58b;--shadow:0 24px 90px rgba(0,0,0,.38);\n      --app-height:100dvh;--radius:18px;--safe-top:env(safe-area-inset-top);--safe-bottom:env(safe-area-inset-bottom);\n      font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;\n    }\n    body.light{--bg:#f3f3f0;--panel:#fff;--panel-2:#f7f7f4;--panel-3:#ecece8;--line:#deded8;--text:#111;--muted:#74746f;--soft:#333;--accent:#111;--accent-text:#fff;--shadow:0 24px 70px rgba(0,0,0,.13)}\n    *{box-sizing:border-box}\n    html,body{width:100%;height:100%;margin:0;-webkit-text-size-adjust:100%}\n    body{background:var(--bg);color:var(--text);overflow:hidden;max-width:100vw}\n    button,input,textarea,select{font:inherit}\n    button{touch-action:manipulation}\n    .hidden{display:none!important}\n    .screen{position:fixed;inset:0;width:100%;height:var(--app-height);min-height:0}\n    .auth-screen{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(360px,520px);background:var(--bg);overflow:auto;overflow-x:hidden}\n    .auth-hero{position:relative;min-width:0;min-height:100%;padding:clamp(32px,5vw,76px);display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid var(--line);overflow:hidden}\n    .auth-hero:after{content:\"\";position:absolute;right:-180px;bottom:-220px;width:540px;height:540px;border:1px solid var(--line);border-radius:50%;box-shadow:0 0 0 76px var(--bg),0 0 0 77px var(--line),0 0 0 152px var(--bg)}\n    .brand{font-size:26px;font-weight:800;letter-spacing:-.05em;position:relative;z-index:1}\n    .hero-copy{position:relative;z-index:1;max-width:760px;min-width:0}\n    .eyebrow{text-transform:uppercase;letter-spacing:.18em;color:var(--muted);font-size:11px;margin-bottom:18px}\n    h1{font-size:clamp(50px,7vw,108px);line-height:.88;letter-spacing:-.075em;margin:0;font-weight:650;max-width:100%;overflow-wrap:normal}\n    .hero-copy p{color:var(--muted);font-size:17px;line-height:1.65;max-width:540px;margin:30px 0 0}\n    .auth-foot{position:relative;z-index:1;color:var(--muted);font-size:12px}\n    .auth-panel{background:var(--panel);display:flex;align-items:center;padding:clamp(24px,5vw,64px);min-height:100%;min-width:0;overflow:auto}\n    .auth-card{width:100%;max-width:420px;margin:auto}\n    .tabs{display:flex;gap:24px;border-bottom:1px solid var(--line);margin-bottom:30px}\n    .tab{border:0;background:none;color:var(--muted);padding:0 0 14px;cursor:pointer;font-weight:700;position:relative}\n    .tab.active{color:var(--text)}\n    .tab.active:after{content:\"\";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:var(--text)}\n    form{display:grid;gap:16px}\n    label{display:grid;gap:7px;color:var(--muted);font-size:12px}\n    input,textarea,select{width:100%;border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:12px;padding:14px 15px;outline:none;min-width:0}\n    input:focus,textarea:focus,select:focus{border-color:var(--muted)}\n    textarea{resize:vertical;min-height:100px}\n    .primary,.secondary,.danger-btn,.icon-btn,.chip-btn{border-radius:12px;cursor:pointer;transition:.16s ease}\n    .primary{border:1px solid var(--accent);background:var(--accent);color:var(--accent-text);padding:14px 18px;font-weight:800}\n    .secondary{border:1px solid var(--line);background:transparent;color:var(--text);padding:12px 15px;font-weight:700}\n    .danger-btn{border:1px solid color-mix(in srgb,var(--danger) 55%,var(--line));background:transparent;color:var(--danger);padding:12px 15px;font-weight:700}\n    .primary:active,.secondary:active,.danger-btn:active,.icon-btn:active,.chip-btn:active{transform:scale(.97)}\n    button:disabled{opacity:.45;cursor:wait}\n    .link-btn{border:0;background:none;color:var(--muted);padding:0;cursor:pointer;text-align:left;width:max-content}\n    .notice{border:1px solid var(--line);background:var(--bg);border-radius:14px;padding:14px 15px;margin-bottom:18px;display:none}\n    .notice.show{display:block}.notice.error{border-color:color-mix(in srgb,var(--danger) 60%,var(--line));color:var(--danger)}.notice.ok{color:var(--success)}\n    .yandex-btn{width:100%;min-height:50px;border:1px solid var(--line);background:var(--text);color:var(--bg);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;cursor:pointer;margin-bottom:16px;touch-action:manipulation}\n    .yandex-btn:active{transform:scale(.98)}.yandex-mark{width:26px;height:26px;border-radius:8px;background:#fc3f1d;color:#fff;display:grid;place-items:center;font-weight:900;font-size:16px;line-height:1}\n    .auth-divider{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:11px;margin:0 0 16px}.auth-divider:before,.auth-divider:after{content:\"\";height:1px;background:var(--line);flex:1}\n    .field-error{color:var(--danger);font-size:11px;min-height:0}.field-hint{color:var(--muted);font-size:11px;line-height:1.35}.field-error:not(:empty){min-height:15px}\n    .app{display:grid;grid-template-columns:minmax(280px,350px) minmax(0,1fr);background:var(--bg);overflow:hidden}\n    .sidebar,.chat-view{min-height:0;height:100%;overflow:hidden}\n    .sidebar{display:flex;flex-direction:column;background:var(--panel);border-right:1px solid var(--line)}\n    .side-head{padding:calc(12px + var(--safe-top)) 14px 12px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line);flex:0 0 auto}\n    .side-brand{font-size:22px;font-weight:850;letter-spacing:-.05em;flex:1}\n    .icon-btn{width:42px;height:42px;border:1px solid var(--line);background:transparent;color:var(--text);display:grid;place-items:center;font-size:18px}\n    .side-search{padding:10px 12px;border-bottom:1px solid var(--line);flex:0 0 auto}\n    .side-search input{background:var(--panel-2);padding:11px 13px}\n    .chat-list{flex:1;min-height:0;overflow:auto;padding:8px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}\n    .chat-row{width:100%;border:0;background:transparent;color:var(--text);padding:11px;border-radius:15px;display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:11px;align-items:center;text-align:left;cursor:pointer}\n    .chat-row:hover,.chat-row.active{background:var(--panel-2)}\n    .avatar{width:48px;height:48px;border-radius:50%;background:var(--accent);color:var(--accent-text);display:grid;place-items:center;font-weight:850;overflow:hidden;flex:0 0 auto}\n    .avatar img{width:100%;height:100%;object-fit:cover}\n    .chat-copy{min-width:0}.chat-title{font-weight:780;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chat-preview{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px}\n    .chat-meta{text-align:right;display:grid;justify-items:end;gap:5px}.chat-time{font-size:10px;color:var(--muted)}.badge{min-width:20px;height:20px;border-radius:999px;background:var(--accent);color:var(--accent-text);font-size:10px;font-weight:850;display:grid;place-items:center;padding:0 6px}\n    .side-foot{padding:10px 12px calc(10px + var(--safe-bottom));border-top:1px solid var(--line);display:flex;gap:8px;flex:0 0 auto}\n    .side-foot button{flex:1}\n    .chat-view{display:grid;grid-template-rows:auto minmax(0,1fr) auto;background:var(--bg)}\n    .chat-head{min-height:66px;padding:calc(8px + var(--safe-top)) 14px 8px;border-bottom:1px solid var(--line);background:var(--panel);display:flex;align-items:center;gap:10px;flex:0 0 auto}\n    .mobile-back{display:none}.chat-head-copy{min-width:0;flex:1}.chat-head-title{font-weight:820;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chat-head-sub{font-size:11px;color:var(--muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.head-actions{display:flex;gap:8px}\n    .messages-wrap{position:relative;min-height:0;overflow:hidden}\n    .messages{height:100%;min-height:0;overflow:auto;padding:22px clamp(14px,4vw,52px);display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}\n    .messages-status{position:absolute;inset:0;z-index:8;display:grid;place-items:center;text-align:center;color:var(--muted);background:var(--bg);padding:22px}.messages-status.hidden{display:none!important}\n    .bubble{max-width:min(720px,84%);align-self:flex-start;border:1px solid var(--line);background:var(--panel);border-radius:17px;padding:10px 12px;box-shadow:0 2px 0 rgba(0,0,0,.04)}\n    .bubble.mine{align-self:flex-end;background:var(--accent);color:var(--accent-text);border-color:var(--accent)}\n    .bubble-author{font-size:11px;font-weight:800;color:var(--muted);margin-bottom:5px}.bubble.mine .bubble-author{display:none}\n    .reply-preview{border-left:2px solid currentColor;padding:5px 8px;margin-bottom:7px;opacity:.62;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}\n    .bubble-text{white-space:pre-wrap;word-break:break-word;line-height:1.45}\n    .bubble-foot{display:flex;align-items:center;justify-content:flex-end;gap:7px;margin-top:6px;font-size:9px;opacity:.55}.pin-mark{font-size:11px}.message-menu{border:0;background:transparent;color:inherit;padding:0 2px;cursor:pointer;font-size:16px;line-height:1}\n    .reactions{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.reaction{border:1px solid currentColor;background:transparent;color:inherit;border-radius:999px;padding:3px 7px;font-size:11px;opacity:.75;cursor:pointer}.reaction.mine{opacity:1;font-weight:800}\n    .composer-shell{background:var(--panel);border-top:1px solid var(--line);padding:8px 12px calc(8px + var(--safe-bottom));flex:0 0 auto}\n    .reply-bar{display:flex;align-items:center;gap:10px;padding:8px 10px;margin-bottom:7px;background:var(--panel-2);border-radius:11px;font-size:11px;color:var(--muted)}.reply-bar span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n    .composer{display:grid;grid-template-columns:minmax(0,1fr) 46px;gap:8px}.composer textarea{min-height:46px;max-height:132px;resize:none;padding:12px 13px;background:var(--bg);font-size:16px}.send{width:46px;height:46px;border:0;border-radius:14px;background:var(--accent);color:var(--accent-text);font-size:20px;cursor:pointer}\n    .empty-list{color:var(--muted);padding:24px;text-align:center;font-size:13px}\n    .modal{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.58);display:grid;place-items:center;padding:16px;padding-top:calc(16px + var(--safe-top));padding-bottom:calc(16px + var(--safe-bottom))}\n    .modal-card{width:min(620px,100%);max-height:100%;overflow:hidden;background:var(--panel);border:1px solid var(--line);border-radius:22px;box-shadow:var(--shadow);display:grid;grid-template-rows:auto minmax(0,1fr) auto}\n    .modal-head{padding:15px 16px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:10px}.modal-title{font-weight:820;flex:1}.modal-body{padding:16px;overflow:auto;min-height:0}.modal-foot{padding:12px 16px;border-top:1px solid var(--line);display:flex;justify-content:flex-end;gap:9px}.modal-body h3{margin:6px 0 12px}.modal-body p{color:var(--muted);line-height:1.55}\n    .choice-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.choice{border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:15px;padding:18px 12px;cursor:pointer;text-align:center;font-weight:750}.choice span{display:block;font-size:24px;margin-bottom:8px}\n    .result-list{display:grid;gap:5px;margin-top:12px}.result-row{border:0;background:transparent;color:var(--text);border-radius:13px;padding:10px;display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:10px;align-items:center;text-align:left;cursor:pointer}.result-row:hover{background:var(--panel-2)}.result-row button{justify-self:end}.result-row.is-member{opacity:.58}.result-row .avatar{width:42px;height:42px}.result-name{font-weight:750}.result-sub{font-size:11px;color:var(--muted);margin-top:3px}\n    .form-grid{display:grid;gap:14px}.inline{display:flex;gap:9px;align-items:center}.inline>*{min-width:0}.inline .grow{flex:1}.check{display:flex;gap:9px;align-items:center;color:var(--text);font-size:13px}.check input{width:18px;height:18px;padding:0}\n    .section{border-top:1px solid var(--line);padding-top:14px;margin-top:14px}.member-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:10px;align-items:center;padding:8px 0}.member-actions{display:flex;gap:6px;align-items:center}.member-actions select{padding:8px;width:auto}.chip-btn{border:1px solid var(--line);background:transparent;color:var(--text);padding:7px 9px;font-size:11px}\n    .stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.stat{border:1px solid var(--line);border-radius:14px;padding:13px;background:var(--bg)}.stat b{display:block;font-size:24px}.stat span{font-size:10px;color:var(--muted)}\n    .admin-table{display:grid;gap:7px}.admin-row{border:1px solid var(--line);border-radius:14px;padding:11px;background:var(--bg)}.admin-row-head{display:flex;gap:8px;align-items:center}.admin-row-head strong{flex:1}.admin-row small{color:var(--muted)}.admin-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}.admin-actions select{width:auto;padding:8px}.admin-actions button{padding:8px 10px}\n    .toast-stack{position:fixed;right:14px;bottom:calc(14px + var(--safe-bottom));z-index:100;display:grid;gap:8px;pointer-events:none}.toast{max-width:min(420px,calc(100vw - 28px));padding:12px 14px;border-radius:13px;background:var(--accent);color:var(--accent-text);box-shadow:var(--shadow);font-size:12px;line-height:1.45}.toast.error{background:var(--danger);color:#fff}\n    @media(max-width:1180px){\n      .auth-screen{display:grid;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);overflow:auto;overflow-x:hidden}\n      .auth-hero{min-height:0;height:auto;border-right:0;border-bottom:1px solid var(--line);padding:calc(16px + var(--safe-top)) 24px 16px;display:block}\n      .auth-hero:after,.hero-copy,.auth-foot{display:none}\n      .brand{font-size:24px}\n      .auth-panel{min-height:0;align-items:flex-start;padding:28px 20px calc(28px + var(--safe-bottom));overflow:visible}\n      .auth-card{max-width:520px;margin:0 auto}\n    }\n    @media(max-width:800px){\n      .app{grid-template-columns:1fr}.chat-view{display:none}.app.chat-open .sidebar{display:none}.app.chat-open .chat-view{display:grid}.mobile-back{display:grid}.head-actions .optional-mobile{display:none}\n      .messages{padding:14px 10px}.bubble{max-width:90%}.side-head{min-height:62px}.chat-head{min-height:62px}.composer-shell{padding-left:8px;padding-right:8px}.composer textarea{font-size:16px}\n      .modal{padding:0;padding-top:var(--safe-top);padding-bottom:var(--safe-bottom);align-items:end}.modal-card{width:100%;max-height:94%;border-radius:22px 22px 0 0;border-bottom:0}.choice-grid{grid-template-columns:1fr}.stat-grid{grid-template-columns:repeat(2,1fr)}\n    }\n    @media(max-width:480px){\n      .auth-hero{padding-left:16px;padding-right:16px}.auth-panel{padding:20px 14px calc(20px + var(--safe-bottom))}.tabs{margin-bottom:22px}.primary{min-height:48px}\n    }\n    @media(max-height:700px){\n      .auth-screen{display:block;overflow:auto}.auth-hero{display:none}.auth-panel{min-height:var(--app-height);padding-top:calc(14px + var(--safe-top));padding-bottom:calc(14px + var(--safe-bottom));align-items:flex-start}.auth-card{margin:0 auto}\n    }\n    @media(max-height:590px){.side-head,.chat-head{min-height:54px}.chat-head{padding-top:4px}.messages{padding-top:8px;padding-bottom:8px}.composer-shell{padding-top:5px;padding-bottom:calc(5px + var(--safe-bottom))}.composer textarea{min-height:42px}.send{height:42px}.modal-card{max-height:100%}}\n    @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition:none!important}}\n  </style>\n</head>\n<body>\n  <section id=\"authScreen\" class=\"screen auth-screen\">\n    <div class=\"auth-hero\">\n      <div class=\"brand\">Wavero</div>\n      <div class=\"hero-copy\"><div class=\"eyebrow\">Личные сообщения · группы · каналы</div><h1>Общение<br>без шума.</h1><p>Быстрый мессенджер с единым аккаунтом, удобным поиском и адаптацией под любой экран.</p></div>\n      <div class=\"auth-foot\">Wavero 1.0.6</div>\n    </div>\n    <div class=\"auth-panel\">\n      <div class=\"auth-card\">\n        <div class=\"tabs\"><button id=\"loginTab\" class=\"tab active\">Вход</button><button id=\"registerTab\" class=\"tab\">Регистрация</button></div>\n        <div id=\"authNotice\" class=\"notice\"></div>\n        <button id=\"yandexLoginBtn\" class=\"yandex-btn\" type=\"button\"><span class=\"yandex-mark\">Я</span><span>Продолжить через Яндекс</span></button>\n        <div class=\"auth-divider\"><span>или</span></div>\n        <form id=\"loginForm\" novalidate>\n          <label>Почта или username<input id=\"loginIdentifier\" autocomplete=\"username\" placeholder=\"email или username\"></label>\n          <label>Пароль<input id=\"loginPassword\" type=\"password\" autocomplete=\"current-password\" placeholder=\"Пароль\"></label>\n          <button id=\"loginBtn\" class=\"primary\">Войти</button>\n          <button id=\"resetBtn\" class=\"link-btn\" type=\"button\">Забыли пароль?</button>\n        </form>\n        <form id=\"registerForm\" class=\"hidden\" novalidate>\n          <label>Имя<input id=\"regName\" maxlength=\"50\" autocomplete=\"name\" placeholder=\"Как вас называть\"><span id=\"regNameError\" class=\"field-error\"></span></label>\n          <label>Username<input id=\"regUsername\" maxlength=\"24\" autocapitalize=\"none\" spellcheck=\"false\" placeholder=\"username\"><span id=\"regUsernameError\" class=\"field-error\"></span></label>\n          <label>Email<input id=\"regEmail\" type=\"email\" autocomplete=\"email\" placeholder=\"name@example.com\"><span id=\"regEmailError\" class=\"field-error\"></span></label>\n          <label>Пароль<input id=\"regPassword\" type=\"password\" autocomplete=\"new-password\" placeholder=\"Не менее 8 символов и одна цифра\"><span id=\"regPasswordError\" class=\"field-error\"></span></label>\n          <button id=\"registerBtn\" class=\"primary\">Создать аккаунт</button>\n        </form>\n      </div>\n    </div>\n  </section>\n\n  <section id=\"appShell\" class=\"screen app hidden\">\n    <aside class=\"sidebar\">\n      <header class=\"side-head\"><div class=\"side-brand\">Wavero</div><button id=\"newChatBtn\" class=\"icon-btn\" title=\"Новый чат\">＋</button><button id=\"profileBtn\" class=\"icon-btn\" title=\"Профиль\">◉</button></header>\n      <div class=\"side-search\"><input id=\"chatFilter\" placeholder=\"Поиск по чатам\"></div>\n      <div id=\"chatList\" class=\"chat-list\"></div>\n      <footer class=\"side-foot\"><button id=\"adminBtn\" class=\"secondary hidden\">Админ</button><button id=\"logoutBtn\" class=\"secondary\">Выйти</button></footer>\n    </aside>\n    <main class=\"chat-view\">\n      <header class=\"chat-head\"><button id=\"backBtn\" class=\"icon-btn mobile-back\">‹</button><div class=\"chat-head-copy\"><div id=\"chatTitle\" class=\"chat-head-title\">Выберите чат</div><div id=\"chatSubtitle\" class=\"chat-head-sub\">Сообщения появятся здесь</div></div><div class=\"head-actions\"><button id=\"addMemberHeaderBtn\" class=\"icon-btn hidden\" title=\"Добавить пользователя\">＋</button><button id=\"messageSearchBtn\" class=\"icon-btn optional-mobile\" title=\"Поиск\">⌕</button><button id=\"chatInfoBtn\" class=\"icon-btn\" title=\"Информация\">⋯</button></div></header>\n      <div class=\"messages-wrap\"><div id=\"messages\" class=\"messages\"></div><div id=\"messagesStatus\" class=\"messages-status\">Выберите чат</div></div>\n      <div id=\"composerShell\" class=\"composer-shell hidden\"><div id=\"replyBar\" class=\"reply-bar hidden\"><span id=\"replyText\"></span><button id=\"cancelReply\" class=\"chip-btn\">Отмена</button></div><form id=\"composer\" class=\"composer\"><textarea id=\"messageInput\" rows=\"1\" maxlength=\"4000\" placeholder=\"Сообщение\"></textarea><button class=\"send\" aria-label=\"Отправить\">➤</button></form></div>\n    </main>\n  </section>\n\n  <section id=\"modal\" class=\"modal hidden\" role=\"dialog\" aria-modal=\"true\"><div class=\"modal-card\"><header class=\"modal-head\"><div id=\"modalTitle\" class=\"modal-title\"></div><button id=\"modalClose\" class=\"icon-btn\">×</button></header><div id=\"modalBody\" class=\"modal-body\"></div><footer id=\"modalFoot\" class=\"modal-foot hidden\"></footer></div></section>\n  <div id=\"toastStack\" class=\"toast-stack\" aria-live=\"polite\"></div>\n  <script>\n    \"use strict\";\n    const VERSION=\"1.0.6-embedded-ui\";const API=location.origin;const $=id=>document.getElementById(id);\n    const state={token:null,refreshToken:null,authProvider:null,expiresAt:0,user:null,profile:null,chats:[],activeChat:null,messages:[],poll:null,messageSeq:0,replyTo:null,isAdmin:false};\n    function syncViewport(){const h=window.visualViewport?.height||innerHeight||document.documentElement.clientHeight;document.documentElement.style.setProperty(\"--app-height\",`${Math.max(260,Math.round(h))}px`)}\n    syncViewport();addEventListener(\"resize\",syncViewport,{passive:true});addEventListener(\"orientationchange\",()=>setTimeout(syncViewport,80),{passive:true});window.visualViewport?.addEventListener(\"resize\",syncViewport,{passive:true});\n    function escapeHtml(v){return String(v??\"\").replace(/[&<>'\"]/g,c=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",\"'\":\"&#39;\",'\"':\"&quot;\"}[c]))}\n    function initial(v){return String(v||\"?\").trim().charAt(0).toUpperCase()||\"?\"}\n    function formatTime(v){if(!v)return\"\";const d=new Date(v);const today=new Date();return d.toDateString()===today.toDateString()?d.toLocaleTimeString(\"ru-RU\",{hour:\"2-digit\",minute:\"2-digit\"}):d.toLocaleDateString(\"ru-RU\",{day:\"2-digit\",month:\"2-digit\"})}function formatMessageTime(v){if(!v)return\"\";const d=new Date(v);if(Number.isNaN(d.getTime()))return\"\";const today=new Date();const time=d.toLocaleTimeString(\"ru-RU\",{hour:\"2-digit\",minute:\"2-digit\"});return d.toDateString()===today.toDateString()?time:`${d.toLocaleDateString(\"ru-RU\",{day:\"2-digit\",month:\"2-digit\"})}, ${time}`}\n    function toast(text,type=\"\"){const el=document.createElement(\"div\");el.className=`toast ${type}`;el.textContent=text;$(\"toastStack\").append(el);setTimeout(()=>el.remove(),3800)}\n    function setNotice(text,type=\"\"){const n=$(\"authNotice\");n.textContent=text;n.className=`notice ${text?\"show\":\"\"} ${type}`}\n    function setBusy(btn,on,label){btn.disabled=on;btn.dataset.label||=label||btn.textContent;btn.textContent=on?\"Подождите…\":btn.dataset.label}\n    async function api(path,{method=\"GET\",body,auth=true,headers={},retry=true}={}){let response;try{response=await fetch(`${API}${path}`,{method,headers:{Accept:\"application/json\",...(body!==undefined?{\"Content-Type\":\"application/json\"}:{}),...(auth&&state.token?{Authorization:`Bearer ${state.token}`}:{}) ,...headers},body:body===undefined?undefined:JSON.stringify(body),cache:\"no-store\"})}catch(cause){const e=new Error(\"Нет соединения с сервером.\");e.code=\"NETWORK_ERROR\";e.cause=cause;throw e}const raw=await response.text();let data={};try{data=raw?JSON.parse(raw):{}}catch{data={error:raw.trim()||\"Сервер вернул некорректный ответ.\"}}if(response.status===401&&auth&&retry&&state.refreshToken){const ok=await refreshSession();if(ok)return api(path,{method,body,auth,headers,retry:false})}if(!response.ok){const e=new Error(data.error||data.message||`Ошибка сервера (${response.status}).`);e.code=data.code||`HTTP_${response.status}`;e.requestId=data.request_id||response.headers.get(\"cf-ray\");throw e}return data}function apiErrorText(err){return `${err.message}${err.code?` [${err.code}]`:\"\"}${err.requestId?` · ${err.requestId}`:\"\"}`}\n    function saveSession(s){state.token=s.id_token;const hasRefresh=Object.prototype.hasOwnProperty.call(s,\"refresh_token\");state.refreshToken=hasRefresh?(s.refresh_token||null):state.refreshToken;state.authProvider=s.auth_provider||state.authProvider||(state.refreshToken?\"firebase\":\"yandex\");state.expiresAt=s.expires_at||Date.now()+55*60*1000;localStorage.setItem(\"wavero_session\",JSON.stringify({id_token:state.token,refresh_token:state.refreshToken,auth_provider:state.authProvider,expires_at:state.expiresAt}))}\n    function clearSession(){state.token=null;state.refreshToken=null;state.authProvider=null;state.expiresAt=0;localStorage.removeItem(\"wavero_session\")}\n    async function refreshSession(){if(!state.refreshToken)return false;try{const data=await api(\"/api/auth/refresh\",{method:\"POST\",body:{refresh_token:state.refreshToken},auth:false});saveSession({id_token:data.id_token,refresh_token:data.refresh_token,expires_at:Date.now()+Number(data.expires_in||3600)*1000});return true}catch{clearSession();return false}}\n    function switchAuth(mode){const login=mode===\"login\";$(\"loginForm\").classList.toggle(\"hidden\",!login);$(\"registerForm\").classList.toggle(\"hidden\",login);$(\"loginTab\").classList.toggle(\"active\",login);$(\"registerTab\").classList.toggle(\"active\",!login);setNotice(\"\")}\n    $(\"yandexLoginBtn\").onclick=()=>{setNotice(\"Переходим в Яндекс ID…\",\"ok\");location.assign(\"/api/auth/yandex/start\")};\n    function yandexErrorMessage(code){const messages={access_denied:\"Вход через Яндекс отменён.\",oauth_rejected:\"Яндекс отклонил запрос авторизации.\",state_mismatch:\"Проверка безопасности входа не пройдена. Повторите попытку.\",not_configured:\"Вход через Яндекс ещё не настроен на сервере.\",yandex_token_exchange:\"Яндекс не подтвердил вход. Повторите попытку.\",yandex_profile_failed:\"Не удалось получить профиль Яндекс ID.\",yandex_client_mismatch:\"Настройки приложения Яндекс не совпадают.\",account_unavailable:\"Аккаунт Wavero заблокирован.\",schema_init_failed:\"Сервер не смог подготовить базу авторизации.\",yandex_internal:\"Внутренняя ошибка входа через Яндекс.\"};return messages[code]||\"Не удалось войти через Яндекс.\"}\n    async function completeYandexLogin(){const params=new URLSearchParams(location.search);const ticket=params.get(\"yandex_ticket\");const error=params.get(\"yandex_error\");if(!ticket&&!error)return false;history.replaceState({},\"\",location.pathname);if(error){setNotice(yandexErrorMessage(error),\"error\");return true}setNotice(\"Завершаем вход через Яндекс…\",\"ok\");try{const auth=await api(\"/api/auth/yandex/complete\",{method:\"POST\",auth:false,body:{ticket}});saveSession({id_token:auth.id_token,refresh_token:null,auth_provider:\"yandex\",expires_at:Date.now()+Number(auth.expires_in||2592000)*1000});await enterApp();return true}catch(err){clearSession();setNotice(`${err.message}${err.requestId?` Код: ${err.requestId}`:\"\"}`,\"error\");return true}}\n    $(\"loginTab\").onclick=()=>switchAuth(\"login\");$(\"registerTab\").onclick=()=>switchAuth(\"register\");\n    $(\"regUsername\").oninput=()=>$(\"regUsername\").value=$(\"regUsername\").value.toLowerCase().replace(/[^a-z0-9_]/g,\"\");\n    $(\"loginForm\").onsubmit=async e=>{e.preventDefault();const btn=$(\"loginBtn\");setBusy(btn,true,\"Войти\");try{const auth=await api(\"/api/auth/login\",{method:\"POST\",auth:false,body:{identifier:$(\"loginIdentifier\").value.trim().toLowerCase(),password:$(\"loginPassword\").value}});const pending=JSON.parse(localStorage.getItem(\"wavero_pending_profile\")||\"{}\");const sync=await api(\"/api/auth/sync\",{method:\"POST\",auth:false,headers:{Authorization:`Bearer ${auth.id_token}`},body:{username:pending.username||\"\",display_name:pending.display_name||auth.firebase_user?.display_name||\"\"}});saveSession({id_token:auth.id_token,refresh_token:auth.refresh_token,auth_provider:\"firebase\",expires_at:Date.now()+Number(auth.expires_in||3600)*1000});localStorage.removeItem(\"wavero_pending_profile\");await enterApp()}catch(err){setNotice(err.message,\"error\")}finally{setBusy(btn,false,\"Войти\")}};\n    $(\"registerForm\").onsubmit=async e=>{e.preventDefault();const btn=$(\"registerBtn\");const p={display_name:$(\"regName\").value.trim(),username:$(\"regUsername\").value.trim(),email:$(\"regEmail\").value.trim(),password:$(\"regPassword\").value};[$(\"regNameError\"),$(\"regUsernameError\"),$(\"regEmailError\"),$(\"regPasswordError\")].forEach(x=>x.textContent=\"\");let bad=false;if(!p.display_name){$(\"regNameError\").textContent=\"Введите имя\";bad=true}if(!/^[a-z0-9_]{4,24}$/.test(p.username)){$(\"regUsernameError\").textContent=\"4–24 символа: латиница, цифры и _\";bad=true}if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(p.email)){$(\"regEmailError\").textContent=\"Некорректный email\";bad=true}if(p.password.length<8||!/\\d/.test(p.password)){$(\"regPasswordError\").textContent=\"Не менее 8 символов и одна цифра\";bad=true}if(bad)return;setBusy(btn,true,\"Создать аккаунт\");try{await api(\"/api/auth/register\",{method:\"POST\",auth:false,body:p});localStorage.setItem(\"wavero_pending_profile\",JSON.stringify({username:p.username,display_name:p.display_name}));switchAuth(\"login\");$(\"loginIdentifier\").value=p.email;setNotice(\"Подтвердите email по ссылке из письма, затем войдите.\",\"ok\")}catch(err){setNotice(err.message,\"error\")}finally{setBusy(btn,false,\"Создать аккаунт\")}};\n    $(\"resetBtn\").onclick=()=>openModal(\"Восстановление пароля\",`<form id=\"resetForm\" class=\"form-grid\"><label>Email<input id=\"resetEmail\" type=\"email\" placeholder=\"name@example.com\"></label><button class=\"primary\">Отправить письмо</button></form>`,()=>{$(\"resetForm\").onsubmit=async e=>{e.preventDefault();try{const d=await api(\"/api/auth/reset-password\",{method:\"POST\",auth:false,body:{email:$(\"resetEmail\").value.trim()}});toast(d.message)}catch(err){toast(err.message,\"error\")}}});\n    async function enterApp(){const data=await api(\"/api/bootstrap\");state.user=data.user;state.profile=data.profile;state.chats=data.chats||[];state.isAdmin=Boolean(data.is_admin);applyTheme(state.profile?.theme||\"dark\");$(\"authScreen\").classList.add(\"hidden\");$(\"appShell\").classList.remove(\"hidden\");$(\"adminBtn\").classList.toggle(\"hidden\",!state.isAdmin);renderChats();const invite=new URLSearchParams(location.search).get(\"invite\");if(invite){try{const joined=await api(`/api/invites/${encodeURIComponent(invite)}/join`,{method:\"POST\",body:{}});history.replaceState({},\"\",location.pathname);await reloadChats();await openChat(joined.chat_id)}catch(err){toast(err.message,\"error\")}}}\n    function applyTheme(t){const theme=t===\"system\"?(matchMedia(\"(prefers-color-scheme:light)\").matches?\"light\":\"dark\"):t;document.body.classList.toggle(\"light\",theme===\"light\");document.querySelector('meta[name=\"theme-color\"]').content=theme===\"light\"?\"#f3f3f0\":\"#050505\"}\n    async function reloadChats(){const d=await api(\"/api/me/chats\");state.chats=d.chats||[];renderChats()}\n    function renderChats(){const q=$(\"chatFilter\").value.trim().toLowerCase();const rows=state.chats.filter(c=>!q||`${c.title||\"\"} ${c.username||\"\"} ${c.last_message||\"\"}`.toLowerCase().includes(q));$(\"chatList\").innerHTML=rows.length?rows.map(c=>`<button class=\"chat-row ${state.activeChat?.id===c.id?\"active\":\"\"}\" data-chat=\"${escapeHtml(c.id)}\"><div class=\"avatar\">${initial(c.title||c.username)}</div><div class=\"chat-copy\"><div class=\"chat-title\">${escapeHtml(c.title||c.username||\"Чат\")}</div><div class=\"chat-preview\">${escapeHtml(c.last_message||c.description||chatTypeLabel(c.type))}</div></div><div class=\"chat-meta\"><span class=\"chat-time\">${formatTime(c.last_message_at)}</span>${Number(c.unread_count)>0?`<span class=\"badge\">${Math.min(99,Number(c.unread_count))}</span>`:\"\"}</div></button>`).join(\"\"):`<div class=\"empty-list\">Чатов пока нет</div>`;document.querySelectorAll(\"[data-chat]\").forEach(b=>b.onclick=()=>openChat(b.dataset.chat))}\n    function chatTypeLabel(t){return t===\"channel\"?\"Канал\":t===\"group\"?\"Группа\":\"Диалог\"}\n    $(\"chatFilter\").oninput=renderChats;\n    function showStatus(text){$(\"messagesStatus\").textContent=text;$(\"messagesStatus\").classList.toggle(\"hidden\",!text)}\n    async function openChat(id){const chat=state.chats.find(c=>c.id===id);if(!chat)return;clearInterval(state.poll);state.poll=null;state.messageSeq++;state.activeChat=chat;state.messages=[];state.replyTo=null;renderReply();$(\"appShell\").classList.add(\"chat-open\");$(\"chatTitle\").textContent=chat.title||chat.username||\"Чат\";$(\"chatSubtitle\").textContent=`${chatTypeLabel(chat.type)}${chat.member_count?` · ${chat.member_count}`:\"\"}`;$(\"composerShell\").classList.toggle(\"hidden\",chat.type===\"channel\"&&!['owner','admin','moderator'].includes(chat.role));$(\"addMemberHeaderBtn\").classList.toggle(\"hidden\",chat.type===\"private\"||!['owner','admin'].includes(chat.role));$(\"messages\").replaceChildren();showStatus(\"Загрузка…\");renderChats();await loadMessages(true);markRead();if(state.activeChat?.id===id)state.poll=setInterval(()=>loadMessages(false),3000)}\n    async function loadMessages(force=false){const chatId=state.activeChat?.id;if(!chatId)return;const seq=++state.messageSeq;try{const d=await api(`/api/chats/${encodeURIComponent(chatId)}/messages?limit=120`);if(seq!==state.messageSeq||state.activeChat?.id!==chatId)return;const signature=JSON.stringify((d.messages||[]).map(m=>[m.id,m.edited_at,m.text,m.is_pinned,(m.reactions||[]).length]));if(force||signature!==state.messageSignature){const oldCount=state.messages.length;state.messageSignature=signature;state.messages=d.messages||[];renderMessages();if(state.profile?.sound_enabled&&oldCount&&state.messages.length>oldCount)playTick()}}catch(err){if(seq!==state.messageSeq)return;showStatus(`${err.message}${err.requestId?`\\nКод: ${err.requestId}`:\"\"}`)}}\n    function renderMessages(){const box=$(\"messages\");box.innerHTML=state.messages.map(m=>{const groups={};for(const r of m.reactions||[]){groups[r.emoji]??={count:0,mine:false};groups[r.emoji].count++;groups[r.emoji].mine||=r.mine}const sentAt=formatMessageTime(m.created_at);return`<article class=\"bubble ${m.sender_user_id===state.user.id?\"mine\":\"\"}\" id=\"msg-${escapeHtml(m.id)}\" data-message=\"${escapeHtml(m.id)}\">${m.sender_user_id===state.user.id?\"\":`<div class=\"bubble-author\">${escapeHtml(m.sender_display_name||m.sender_username||\"Пользователь\")}</div>`}${m.reply_to_message_id?`<div class=\"reply-preview\">${escapeHtml(m.reply_sender_display_name||\"Ответ\")}: ${escapeHtml(m.reply_text||\"Сообщение\")}</div>`:\"\"}<div class=\"bubble-text\">${escapeHtml(m.text)}</div>${Object.keys(groups).length?`<div class=\"reactions\">${Object.entries(groups).map(([e,g])=>`<button class=\"reaction ${g.mine?\"mine\":\"\"}\" data-react-message=\"${escapeHtml(m.id)}\" data-emoji=\"${e}\">${e} ${g.count}</button>`).join(\"\")}</div>`:\"\"}<div class=\"bubble-foot\" title=\"${escapeHtml(new Date(m.created_at).toLocaleString(\"ru-RU\"))}\">${m.is_pinned?`<span class=\"pin-mark\">📌</span>`:\"\"}${m.edited_at?\"изм. · \":\"\"}<span>${escapeHtml(sentAt)}</span><button class=\"message-menu\" data-menu=\"${escapeHtml(m.id)}\">⋯</button></div></article>`}).join(\"\");showStatus(state.messages.length?\"\":\"Здесь пока нет сообщений\");requestAnimationFrame(()=>{box.scrollTop=box.scrollHeight});document.querySelectorAll(\"[data-menu]\").forEach(b=>b.onclick=()=>openMessageMenu(b.dataset.menu));document.querySelectorAll(\"[data-react-message]\").forEach(b=>b.onclick=()=>toggleReaction(b.dataset.reactMessage,b.dataset.emoji,b.classList.contains(\"mine\")))}\n    async function markRead(){if(!state.activeChat)return;try{await api(`/api/chats/${encodeURIComponent(state.activeChat.id)}/read`,{method:\"POST\",body:{}});state.activeChat.unread_count=0;renderChats()}catch{}}\n    function playTick(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=600;g.gain.value=.035;o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.04)}catch{}}\n    $(\"composer\").onsubmit=async e=>{e.preventDefault();const input=$(\"messageInput\");const text=input.value.trim();if(!text||!state.activeChat)return;input.value=\"\";autoGrow(input);try{await api(`/api/chats/${encodeURIComponent(state.activeChat.id)}/messages`,{method:\"POST\",body:{text,reply_to_message_id:state.replyTo?.id||null}});state.replyTo=null;renderReply();await loadMessages(true);await reloadChats()}catch(err){input.value=text;toast(err.message,\"error\")}};\n    function autoGrow(el){el.style.height=\"auto\";el.style.height=`${Math.min(132,el.scrollHeight)}px`}$(\"messageInput\").oninput=e=>autoGrow(e.target);\n    function renderReply(){const show=Boolean(state.replyTo);$(\"replyBar\").classList.toggle(\"hidden\",!show);$(\"replyText\").textContent=show?`Ответ: ${state.replyTo.text}`:\"\"}$(\"cancelReply\").onclick=()=>{state.replyTo=null;renderReply()};\n    function openMessageMenu(id){const m=state.messages.find(x=>x.id===id);if(!m)return;const buttons=[`<button id=\"replyAction\" class=\"secondary\">Ответить</button>`,`<button id=\"reactAction\" class=\"secondary\">Реакция</button>`,m.can_edit?`<button id=\"editAction\" class=\"secondary\">Изменить</button>`:\"\",['owner','admin','moderator'].includes(state.activeChat.role)?`<button id=\"pinAction\" class=\"secondary\">${m.is_pinned?\"Открепить\":\"Закрепить\"}</button>`:\"\",`<button id=\"reportAction\" class=\"secondary\">Пожаловаться</button>`,m.can_delete?`<button id=\"deleteAction\" class=\"danger-btn\">Удалить</button>`:\"\"].join(\"\");openModal(\"Сообщение\",`<div class=\"form-grid\">${buttons}</div>`,()=>{$(\"replyAction\").onclick=()=>{state.replyTo=m;renderReply();closeModal();$(\"messageInput\").focus()};$(\"reactAction\").onclick=()=>openReactionPicker(m);if($(\"editAction\"))$(\"editAction\").onclick=()=>openEditMessage(m);if($(\"pinAction\"))$(\"pinAction\").onclick=()=>togglePin(m);$(\"reportAction\").onclick=()=>openReport(\"message\",m.id);if($(\"deleteAction\"))$(\"deleteAction\").onclick=()=>deleteMessage(m)})}\n    function openReactionPicker(m){openModal(\"Реакция\",`<div class=\"choice-grid\">${['👍','❤️','😂','😮','😢','🔥','🎉'].map(e=>`<button class=\"choice emoji-choice\" data-emoji=\"${e}\"><span>${e}</span></button>`).join(\"\")}</div>`,()=>document.querySelectorAll(\".emoji-choice\").forEach(b=>b.onclick=()=>toggleReaction(m.id,b.dataset.emoji,false)))}\n    async function toggleReaction(messageId,emoji,mine){try{await api(`/api/messages/${encodeURIComponent(messageId)}/reactions`,{method:mine?\"DELETE\":\"POST\",body:{emoji}});closeModal();await loadMessages(true)}catch(err){toast(err.message,\"error\")}}\n    function openEditMessage(m){openModal(\"Изменить сообщение\",`<form id=\"editMessageForm\" class=\"form-grid\"><textarea id=\"editMessageText\" maxlength=\"4000\">${escapeHtml(m.text)}</textarea><button class=\"primary\">Сохранить</button></form>`,()=>{$(\"editMessageForm\").onsubmit=async e=>{e.preventDefault();try{await api(`/api/messages/${encodeURIComponent(m.id)}`,{method:\"PATCH\",body:{text:$(\"editMessageText\").value}});closeModal();await loadMessages(true)}catch(err){toast(err.message,\"error\")}}})}\n    async function deleteMessage(m){if(!confirm(\"Удалить сообщение для всех?\"))return;try{await api(`/api/messages/${encodeURIComponent(m.id)}`,{method:\"DELETE\",body:{}});closeModal();await loadMessages(true);await reloadChats()}catch(err){toast(err.message,\"error\")}}\n    async function togglePin(m){try{await api(`/api/messages/${encodeURIComponent(m.id)}/pin`,{method:m.is_pinned?\"DELETE\":\"POST\",body:{}});closeModal();await loadMessages(true)}catch(err){toast(err.message,\"error\")}}\n    $(\"backBtn\").onclick=()=>{$(\"appShell\").classList.remove(\"chat-open\");clearInterval(state.poll)};\n    $(\"newChatBtn\").onclick=()=>openModal(\"Новый чат\",`<div class=\"choice-grid\"><button id=\"newDirect\" class=\"choice\"><span>◌</span>Диалог</button><button id=\"newGroup\" class=\"choice\"><span>◎</span>Группа</button><button id=\"newChannel\" class=\"choice\"><span>◉</span>Канал</button></div>`,()=>{$(\"newDirect\").onclick=openDirectSearch;$(\"newGroup\").onclick=()=>openCreateChat(\"group\");$(\"newChannel\").onclick=()=>openCreateChat(\"channel\")});\n    function openDirectSearch(){openModal(\"Новый диалог\",`<input id=\"userSearch\" placeholder=\"Имя, username или email\"><div id=\"userResults\" class=\"result-list\"><div class=\"empty-list\">Введите минимум 2 символа</div></div>`,()=>{let timer;$(\"userSearch\").oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>searchUsers($(\"userSearch\").value),260)};$(\"userSearch\").focus()})}\n    async function searchUsers(q){if(q.trim().length<2){$(\"userResults\").innerHTML=`<div class=\"empty-list\">Введите минимум 2 символа</div>`;return}try{const d=await api(`/api/directory?q=${encodeURIComponent(q)}&exclude=${encodeURIComponent(state.user.id)}`);$(\"userResults\").innerHTML=(d.users||[]).length?(d.users||[]).map(u=>`<button class=\"result-row\" data-user=\"${escapeHtml(u.id)}\"><div class=\"avatar\">${initial(u.display_name||u.username)}</div><div><div class=\"result-name\">${escapeHtml(u.display_name||u.username)}</div><div class=\"result-sub\">@${escapeHtml(u.username)}</div></div><span>Начать</span></button>`).join(\"\"):`<div class=\"empty-list\">Ничего не найдено</div>`;document.querySelectorAll(\"[data-user]\").forEach(b=>b.onclick=()=>startDirect(b.dataset.user))}catch(err){$(\"userResults\").innerHTML=`<div class=\"empty-list\">${escapeHtml(err.message)}</div>`}}\n    async function startDirect(userId){try{const d=await api(\"/api/chats/direct\",{method:\"POST\",body:{target_user_id:userId}});closeModal();await reloadChats();await openChat(d.chat_id)}catch(err){toast(err.message,\"error\")}}\n    function openCreateChat(type){const kind=type===\"channel\"?\"канал\":\"группа\";openModal(type===\"channel\"?\"Новый канал\":\"Новая группа\",`<form id=\"createChatForm\" class=\"form-grid\"><label>Название<input id=\"createTitle\" maxlength=\"80\" autocomplete=\"off\"><span id=\"createTitleError\" class=\"field-error\"></span></label><label>Описание<textarea id=\"createDescription\" maxlength=\"500\"></textarea></label><label>Username<input id=\"createUsername\" maxlength=\"32\" autocapitalize=\"none\" spellcheck=\"false\" placeholder=\"например, news_channel\"><span class=\"field-hint\">Нужен только для публичного ${kind===\"канал\"?\"канала\":\"чата\"}.</span><span id=\"createUsernameError\" class=\"field-error\"></span></label><label class=\"check\"><input id=\"createPublic\" type=\"checkbox\">Публичный ${kind}</label><button id=\"createChatSubmit\" class=\"primary\">Создать</button></form>`,()=>{const username=$(\"createUsername\"),publicBox=$(\"createPublic\"),title=$(\"createTitle\"),submit=$(\"createChatSubmit\");username.oninput=()=>{username.value=username.value.toLowerCase().replace(/[^a-z0-9_]/g,\"\");$(\"createUsernameError\").textContent=\"\"};publicBox.onchange=()=>{$(\"createUsernameError\").textContent=publicBox.checked&&!username.value?`Для публичного ${kind===\"канал\"?\"канала\":\"чата\"} укажите username.`:\"\"};$(\"createChatForm\").onsubmit=async e=>{e.preventDefault();$(\"createTitleError\").textContent=\"\";$(\"createUsernameError\").textContent=\"\";const titleValue=title.value.trim(),usernameValue=username.value.trim();let invalid=false;if(titleValue.length<2){$(\"createTitleError\").textContent=\"Минимум 2 символа.\";invalid=true}if(usernameValue&&!/^[a-z0-9_]{4,32}$/.test(usernameValue)){$(\"createUsernameError\").textContent=\"4–32 символа: латиница, цифры и _.\";invalid=true}if(publicBox.checked&&!usernameValue){$(\"createUsernameError\").textContent=`Для публичного ${kind===\"канал\"?\"канала\":\"чата\"} укажите username или снимите галочку.`;username.focus();invalid=true}if(invalid)return;setBusy(submit,true,\"Создать\");try{const d=await api(\"/api/chats\",{method:\"POST\",body:{type,title:titleValue,description:$(\"createDescription\").value,username:usernameValue,is_public:publicBox.checked}});closeModal();await reloadChats();await openChat(d.chat_id);toast(type===\"channel\"?\"Канал создан\":\"Группа создана\")}catch(err){toast(apiErrorText(err),\"error\")}finally{setBusy(submit,false,\"Создать\")}}})}\n    async function openAddMember(){\n      const chat=state.activeChat;\n      if(!chat||chat.type==='private')return toast(\"Добавлять пользователей можно в группу или канал.\",\"error\");\n      let info;\n      try{info=await api(`/api/chats/${encodeURIComponent(chat.id)}`)}catch(err){return toast(apiErrorText(err),\"error\")}\n      if(!['owner','admin'].includes(info.chat.role))return toast(\"Добавлять участников могут владелец и администратор.\",\"error\");\n      const existing=new Set((info.members||[]).map(member=>member.id));\n      openModal(\"Добавить пользователя\",`<div class=\"form-grid\"><label>Поиск по имени или username<input id=\"memberSearchInput\" autocomplete=\"off\" autocapitalize=\"none\" placeholder=\"Введите минимум 2 символа\"></label><div id=\"memberSearchResults\" class=\"result-list\"><div class=\"empty-list\">Начните вводить имя</div></div></div>`,()=>{\n        let timer=0,seq=0;\n        const input=$(\"memberSearchInput\"),results=$(\"memberSearchResults\");\n        const search=()=>{clearTimeout(timer);timer=setTimeout(async()=>{const q=input.value.trim();const request=++seq;if(q.length<2){results.innerHTML='<div class=\"empty-list\">Введите минимум 2 символа</div>';return}results.innerHTML='<div class=\"empty-list\">Ищем…</div>';try{const d=await api(`/api/directory?q=${encodeURIComponent(q)}&exclude=${encodeURIComponent(state.user.id)}`);if(request!==seq)return;const users=(d.users||[]);results.innerHTML=users.map(u=>{const member=existing.has(u.id);return`<div class=\"result-row ${member?'is-member':''}\"><div class=\"avatar\">${initial(u.display_name||u.username)}</div><div><div class=\"result-name\">${escapeHtml(u.display_name||u.username)}</div><div class=\"result-sub\">@${escapeHtml(u.username)}</div></div>${member?'<span class=\"result-sub\">Уже добавлен</span>':`<button class=\"chip-btn\" data-add-user=\"${escapeHtml(u.id)}\">Добавить</button>`}</div>`}).join(\"\")||'<div class=\"empty-list\">Пользователи не найдены</div>';document.querySelectorAll(\"[data-add-user]\").forEach(button=>button.onclick=async()=>{button.disabled=true;try{await api(`/api/chats/${encodeURIComponent(chat.id)}/members`,{method:\"POST\",body:{user_id:button.dataset.addUser}});toast(chat.type==='channel'?\"Подписчик добавлен\":\"Участник добавлен\");await reloadChats();await openChatInfo()}catch(err){button.disabled=false;toast(apiErrorText(err),\"error\")}})}catch(err){if(request===seq)results.innerHTML=`<div class=\"empty-list\">${escapeHtml(apiErrorText(err))}</div>`}},280)};\n        input.oninput=search;input.focus();\n      });\n    }\n    $(\"addMemberHeaderBtn\").onclick=()=>openAddMember();\n    $(\"chatInfoBtn\").onclick=()=>state.activeChat?openChatInfo():toast(\"Сначала выберите чат\");\n    async function openChatInfo(){try{const d=await api(`/api/chats/${encodeURIComponent(state.activeChat.id)}`);const c=d.chat;const manage=['owner','admin'].includes(c.role);const baseRole=c.type==='channel'?'subscriber':'member';const baseLabel=c.type==='channel'?'Подписчик':'Участник';const members=(d.members||[]).map(m=>`<div class=\"member-row\"><div class=\"avatar\">${initial(m.display_name||m.username)}</div><div><div class=\"result-name\">${escapeHtml(m.display_name||m.username)}</div><div class=\"result-sub\">@${escapeHtml(m.username)} · ${escapeHtml(m.role)}</div></div>${manage&&m.role!==\"owner\"?`<div class=\"member-actions\"><select data-role-user=\"${escapeHtml(m.id)}\"><option value=\"${baseRole}\" ${m.role===baseRole?'selected':''}>${baseLabel}</option><option value=\"moderator\" ${m.role==='moderator'?'selected':''}>Модератор</option><option value=\"admin\" ${m.role==='admin'?'selected':''}>Админ</option></select><button class=\"chip-btn\" data-remove-user=\"${escapeHtml(m.id)}\">Удалить</button></div>`:`<span>${escapeHtml(m.role)}</span>`}</div>`).join(\"\");const privateBlock=c.type==='private'&&c.peer_user_id?`<button id=\"toggleBlockPeer\" class=\"${c.peer_blocked_by_me?'secondary':'danger-btn'}\">${c.peer_blocked_by_me?'Разблокировать пользователя':'Заблокировать пользователя'}</button>`:\"\";openModal(\"Информация о чате\",`<div class=\"form-grid\">${c.type!=='private'?`<label>Название<input id=\"infoTitle\" value=\"${escapeHtml(c.title||\"\")}\" ${manage?\"\":\"disabled\"}></label><label>Описание<textarea id=\"infoDescription\" ${manage?\"\":\"disabled\"}>${escapeHtml(c.description||\"\")}</textarea></label><label>Username<input id=\"infoUsername\" value=\"${escapeHtml(c.username||\"\")}\" ${manage?\"\":\"disabled\"}></label><label class=\"check\"><input id=\"infoPublic\" type=\"checkbox\" ${c.is_public?'checked':''} ${manage?\"\":\"disabled\"}>Публичный ${c.type==='channel'?'канал':'чат'}</label>${manage?`<button id=\"saveChatInfo\" class=\"primary\">Сохранить</button><button id=\"searchAddMemberBtn\" class=\"secondary\">Добавить пользователя</button><button id=\"inviteBtn\" class=\"secondary\">Создать ссылку-приглашение</button>`:\"\"}`:\"\"}${privateBlock}<div class=\"section\"><h3>Участники · ${d.members?.length||0}</h3>${members||'<div class=\"empty-list\">Нет участников</div>'}</div></div>`,()=>{if(manage&&$(\"saveChatInfo\"))$(\"saveChatInfo\").onclick=async()=>{try{await api(`/api/chats/${encodeURIComponent(state.activeChat.id)}`,{method:\"PATCH\",body:{title:$(\"infoTitle\").value,description:$(\"infoDescription\").value,username:$(\"infoUsername\").value,is_public:$(\"infoPublic\").checked}});toast(\"Сохранено\");closeModal();await reloadChats()}catch(err){toast(apiErrorText(err),\"error\")}};if($(\"searchAddMemberBtn\"))$(\"searchAddMemberBtn\").onclick=openAddMember;if($(\"inviteBtn\"))$(\"inviteBtn\").onclick=async()=>{try{const x=await api(`/api/chats/${encodeURIComponent(state.activeChat.id)}/invites`,{method:\"POST\",body:{expires_in_hours:168}});await navigator.clipboard?.writeText(x.invite.url);toast(`Ссылка создана: ${x.invite.url}`)}catch(err){toast(apiErrorText(err),\"error\")}};document.querySelectorAll(\"[data-role-user]\").forEach(s=>s.onchange=async()=>{try{await api(`/api/chats/${encodeURIComponent(state.activeChat.id)}/members/${encodeURIComponent(s.dataset.roleUser)}`,{method:\"PATCH\",body:{role:s.value}});toast(\"Роль обновлена\")}catch(err){toast(apiErrorText(err),\"error\")}});document.querySelectorAll(\"[data-remove-user]\").forEach(b=>b.onclick=async()=>{if(!confirm(\"Удалить участника?\"))return;try{await api(`/api/chats/${encodeURIComponent(state.activeChat.id)}/members/${encodeURIComponent(b.dataset.removeUser)}`,{method:\"DELETE\",body:{}});await reloadChats();openChatInfo()}catch(err){toast(apiErrorText(err),\"error\")}});if($(\"toggleBlockPeer\"))$(\"toggleBlockPeer\").onclick=async()=>{const button=$(\"toggleBlockPeer\");button.disabled=true;try{if(c.peer_blocked_by_me){await api(`/api/me/blocks/${encodeURIComponent(c.peer_user_id)}/unblock`,{method:\"POST\",body:{}});toast(\"Пользователь разблокирован\")}else{await api(`/api/me/blocks/${encodeURIComponent(c.peer_user_id)}`,{method:\"POST\",body:{}});toast(\"Пользователь заблокирован\")}await openChatInfo()}catch(err){button.disabled=false;toast(apiErrorText(err),\"error\")}}})}catch(err){toast(apiErrorText(err),\"error\")}}\n    $(\"messageSearchBtn\").onclick=()=>{if(!state.activeChat)return;openModal(\"Поиск в чате\",`<input id=\"messageSearchInput\" placeholder=\"Текст сообщения\"><div id=\"messageSearchResults\" class=\"result-list\"></div>`,()=>{let t;$(\"messageSearchInput\").oninput=()=>{clearTimeout(t);t=setTimeout(async()=>{const q=$(\"messageSearchInput\").value.trim();if(q.length<2)return $(\"messageSearchResults\").innerHTML=\"\";try{const d=await api(`/api/chats/${encodeURIComponent(state.activeChat.id)}/search?q=${encodeURIComponent(q)}`);$(\"messageSearchResults\").innerHTML=(d.messages||[]).map(m=>`<button class=\"result-row\" data-found=\"${escapeHtml(m.id)}\"><div class=\"avatar\">${initial(m.sender_display_name)}</div><div><div class=\"result-name\">${escapeHtml(m.sender_display_name||m.sender_username)}</div><div class=\"result-sub\">${escapeHtml(m.text)}</div></div><span>${formatTime(m.created_at)}</span></button>`).join(\"\")||`<div class=\"empty-list\">Не найдено</div>`;document.querySelectorAll(\"[data-found]\").forEach(b=>b.onclick=()=>{closeModal();document.getElementById(`msg-${b.dataset.found}`)?.scrollIntoView({behavior:\"smooth\",block:\"center\"})})}catch(err){toast(err.message,\"error\")}},250)}})};\n    $(\"profileBtn\").onclick=openProfile;\n    function openProfile(){const p=state.profile||{};openModal(\"Профиль и настройки\",`<form id=\"profileForm\" class=\"form-grid\"><label>Имя<input id=\"profileName\" maxlength=\"50\" value=\"${escapeHtml(state.user.display_name)}\"></label><label>Username<input id=\"profileUsername\" maxlength=\"24\" value=\"${escapeHtml(state.user.username)}\"></label><label>О себе<textarea id=\"profileBio\" maxlength=\"280\">${escapeHtml(p.bio||\"\")}</textarea></label><label>Ссылка на аватар<input id=\"profileAvatar\" value=\"${escapeHtml(p.avatar_url||\"\")}\" placeholder=\"https://...\"></label><label>Тема<select id=\"profileTheme\"><option value=\"dark\" ${p.theme==='dark'?'selected':''}>Тёмная</option><option value=\"light\" ${p.theme==='light'?'selected':''}>Светлая</option><option value=\"system\" ${p.theme==='system'?'selected':''}>Как в системе</option></select></label><label class=\"check\"><input id=\"profileSound\" type=\"checkbox\" ${p.sound_enabled?'checked':''}>Звуки новых сообщений</label><label class=\"check\"><input id=\"profileNotifications\" type=\"checkbox\" ${p.notifications_enabled?'checked':''}>Уведомления</label><button class=\"primary\">Сохранить</button><button id=\"blockedBtn\" class=\"secondary\" type=\"button\">Заблокированные пользователи</button></form>`,()=>{$(\"profileUsername\").oninput=()=>$(\"profileUsername\").value=$(\"profileUsername\").value.toLowerCase().replace(/[^a-z0-9_]/g,\"\");$(\"profileForm\").onsubmit=async e=>{e.preventDefault();try{const d=await api(\"/api/me/profile\",{method:\"PATCH\",body:{display_name:$(\"profileName\").value,username:$(\"profileUsername\").value,bio:$(\"profileBio\").value,avatar_url:$(\"profileAvatar\").value,theme:$(\"profileTheme\").value,sound_enabled:$(\"profileSound\").checked,notifications_enabled:$(\"profileNotifications\").checked}});state.user=d.user;state.profile=d.profile;applyTheme(d.profile.theme);toast(\"Профиль сохранён\");closeModal();await reloadChats()}catch(err){toast(err.message,\"error\")}};$(\"blockedBtn\").onclick=openBlocked})}\n    async function openBlocked(){try{const d=await api(\"/api/me/blocks\");openModal(\"Заблокированные\",`<div class=\"result-list\">${(d.users||[]).map(u=>`<div class=\"result-row\"><div class=\"avatar\">${initial(u.display_name)}</div><div><div class=\"result-name\">${escapeHtml(u.display_name||u.username)}</div><div class=\"result-sub\">@${escapeHtml(u.username)}</div></div><button class=\"chip-btn\" data-unblock=\"${escapeHtml(u.id)}\">Разблокировать</button></div>`).join(\"\")||'<div class=\"empty-list\">Список пуст</div>'}</div>`,()=>document.querySelectorAll(\"[data-unblock]\").forEach(b=>b.onclick=async()=>{b.disabled=true;try{await api(`/api/me/blocks/${encodeURIComponent(b.dataset.unblock)}/unblock`,{method:\"POST\",body:{}});toast(\"Пользователь разблокирован\");await openBlocked()}catch(err){b.disabled=false;toast(apiErrorText(err),\"error\")}}))}catch(err){toast(apiErrorText(err),\"error\")}}\n    function openReport(type,id){openModal(\"Жалоба\",`<form id=\"reportForm\" class=\"form-grid\"><label>Причина<select id=\"reportReason\"><option>Спам</option><option>Оскорбления</option><option>Мошенничество</option><option>Запрещённый контент</option><option>Другое</option></select></label><label>Описание<textarea id=\"reportDetails\" maxlength=\"1000\"></textarea></label><button class=\"primary\">Отправить</button></form>`,()=>{$(\"reportForm\").onsubmit=async e=>{e.preventDefault();try{await api(\"/api/reports\",{method:\"POST\",body:{target_type:type,target_id:id,reason:$(\"reportReason\").value,details:$(\"reportDetails\").value}});toast(\"Жалоба отправлена\");closeModal()}catch(err){toast(err.message,\"error\")}}})}\n    $(\"adminBtn\").onclick=()=>openAdmin();\n    async function openAdmin(q=\"\"){try{const d=await api(`/api/admin/overview?q=${encodeURIComponent(q)}`);openModal(\"Администрирование\",`<div class=\"stat-grid\"><div class=\"stat\"><b>${d.stats.users}</b><span>пользователей</span></div><div class=\"stat\"><b>${d.stats.chats}</b><span>чатов</span></div><div class=\"stat\"><b>${d.stats.messages}</b><span>сообщений</span></div><div class=\"stat\"><b>${d.stats.open_reports}</b><span>жалоб</span></div></div><div class=\"section\"><div class=\"inline\"><input id=\"adminSearch\" class=\"grow\" value=\"${escapeHtml(q)}\" placeholder=\"Поиск пользователей\"><button id=\"adminSearchBtn\" class=\"secondary\">Найти</button></div><h3>Пользователи</h3><div class=\"admin-table\">${(d.users||[]).map(u=>`<div class=\"admin-row\"><div class=\"admin-row-head\"><strong>${escapeHtml(u.display_name||u.username)}</strong><small>@${escapeHtml(u.username)} · ${escapeHtml(u.email||\"\")}</small></div><div class=\"admin-actions\"><select data-admin-status=\"${escapeHtml(u.id)}\"><option value=\"active\" ${u.status==='active'?'selected':''}>Активен</option><option value=\"suspended\" ${u.status==='suspended'?'selected':''}>Заблокирован</option><option value=\"deleted\" ${u.status==='deleted'?'selected':''}>Удалён</option></select><select data-admin-role=\"${escapeHtml(u.id)}\"><option value=\"user\" ${u.role==='user'?'selected':''}>Пользователь</option><option value=\"moderator\" ${u.role==='moderator'?'selected':''}>Модератор</option><option value=\"admin\" ${u.role==='admin'?'selected':''}>Админ</option><option value=\"owner\" ${u.role==='owner'?'selected':''}>Владелец</option></select><button class=\"secondary\" data-admin-save=\"${escapeHtml(u.id)}\">Сохранить</button></div></div>`).join(\"\")}</div></div><div class=\"section\"><h3>Жалобы</h3><div class=\"admin-table\">${(d.reports||[]).map(r=>`<div class=\"admin-row\"><div class=\"admin-row-head\"><strong>${escapeHtml(r.reason)}</strong><small>${escapeHtml(r.target_type)} · ${escapeHtml(r.status)}</small></div><p>${escapeHtml(r.details||\"\")}</p><div class=\"admin-actions\"><select data-report-status=\"${escapeHtml(r.id)}\"><option value=\"open\" ${r.status==='open'?'selected':''}>Открыта</option><option value=\"reviewing\" ${r.status==='reviewing'?'selected':''}>Проверяется</option><option value=\"resolved\" ${r.status==='resolved'?'selected':''}>Решена</option><option value=\"rejected\" ${r.status==='rejected'?'selected':''}>Отклонена</option></select><button class=\"secondary\" data-report-save=\"${escapeHtml(r.id)}\">Сохранить</button></div></div>`).join(\"\")||'<div class=\"empty-list\">Жалоб нет</div>'}</div></div>`,()=>{$(\"adminSearchBtn\").onclick=()=>openAdmin($(\"adminSearch\").value);document.querySelectorAll(\"[data-admin-save]\").forEach(b=>b.onclick=async()=>{const id=b.dataset.adminSave;const status=document.querySelector(`[data-admin-status=\"${CSS.escape(id)}\"]`).value;const role=document.querySelector(`[data-admin-role=\"${CSS.escape(id)}\"]`).value;try{await api(`/api/admin/users/${encodeURIComponent(id)}`,{method:\"PATCH\",body:{status,role}});toast(\"Пользователь обновлён\")}catch(err){toast(err.message,\"error\")}});document.querySelectorAll(\"[data-report-save]\").forEach(b=>b.onclick=async()=>{const id=b.dataset.reportSave;const status=document.querySelector(`[data-report-status=\"${CSS.escape(id)}\"]`).value;try{await api(`/api/admin/reports/${encodeURIComponent(id)}`,{method:\"PATCH\",body:{status,resolution:\"Обработано администратором\"}});toast(\"Жалоба обновлена\")}catch(err){toast(err.message,\"error\")}})})}catch(err){toast(err.message,\"error\")}}\n    function openModal(title,html,ready){$(\"modalTitle\").textContent=title;$(\"modalBody\").innerHTML=html;$(\"modalFoot\").classList.add(\"hidden\");$(\"modal\").classList.remove(\"hidden\");setTimeout(()=>ready?.(),0)}function closeModal(){$(\"modal\").classList.add(\"hidden\");$(\"modalBody\").innerHTML=\"\"}$(\"modalClose\").onclick=closeModal;$(\"modal\").onclick=e=>{if(e.target===$(\"modal\"))closeModal()};\n    $(\"logoutBtn\").onclick=async()=>{clearInterval(state.poll);try{await api(\"/api/auth/logout\",{method:\"POST\",body:{}})}catch{}clearSession();location.reload()};\n    async function restore(){const saved=JSON.parse(localStorage.getItem(\"wavero_session\")||\"null\");if(!saved)return;if(saved.expires_at<Date.now()+30000){state.refreshToken=saved.refresh_token||null;state.authProvider=saved.auth_provider||null;if(!await refreshSession())return}else saveSession(saved);try{await enterApp()}catch{clearSession()}}\n    (async()=>{const handled=await completeYandexLogin();if(!handled)await restore()})();\n  </script>\n</body>\n</html>\n";

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
CREATE TABLE IF NOT EXISTS wavero_oauth_identities (
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  provider_login TEXT NOT NULL DEFAULT '',
  provider_email TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (provider, provider_user_id)
);
CREATE TABLE IF NOT EXISTS wavero_access_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE TABLE IF NOT EXISTS wavero_oauth_tickets (
  ticket_hash TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_wavero_chat_state_user ON wavero_chat_state(user_id, archived, updated_at);
CREATE INDEX IF NOT EXISTS idx_wavero_reactions_message ON wavero_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_wavero_replies_target ON wavero_message_replies(reply_to_message_id);
CREATE INDEX IF NOT EXISTS idx_wavero_pins_chat ON wavero_pinned_messages(chat_id, pinned_at);
CREATE INDEX IF NOT EXISTS idx_wavero_invites_chat ON wavero_invites(chat_id, is_active);
CREATE INDEX IF NOT EXISTS idx_wavero_blocks_blocked ON wavero_blocks_v1(blocked_user_id);
CREATE INDEX IF NOT EXISTS idx_wavero_reports_status ON wavero_reports_v1(status, created_at);
CREATE INDEX IF NOT EXISTS idx_wavero_oauth_identity_user ON wavero_oauth_identities(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_wavero_access_sessions_user ON wavero_access_sessions(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_wavero_oauth_tickets_expiry ON wavero_oauth_tickets(expires_at, used_at);
INSERT INTO wavero_meta(key, value, updated_at)
VALUES ('schema_version', '1.0.5', CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at;`;
let schemaPromise = null;

function schemaStatements() {
  // D1 may interpret line breaks passed to DDL execution as separate SQL lines.
  // Split by statement terminators and collapse every statement to one line.
  return EXTENSION_SCHEMA
    .split(";")
    .map((statement) => statement.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

async function ensureSchema(env) {
  if (!env.DB) throw new ApiError(500, "База данных не подключена.", "DB_NOT_CONFIGURED");

  if (!schemaPromise) {
    schemaPromise = (async () => {
      const statements = schemaStatements();
      for (let index = 0; index < statements.length; index += 1) {
        const statement = statements[index];
        try {
          await env.DB.prepare(statement).run();
        } catch (error) {
          console.error("WAVERO_SCHEMA_ERROR", {
            step: index + 1,
            statement: statement.slice(0, 180),
            message: error?.message,
            stack: error?.stack,
          });
          throw new ApiError(500, "Не удалось подготовить структуру данных Wavero.", "SCHEMA_INIT_FAILED");
        }
      }
      return true;
    })().catch((error) => {
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

      if (request.method === "GET" && url.pathname === "/api/auth/yandex/start") return startYandexAuth(request, env);
      if (request.method === "GET" && url.pathname === "/api/auth/yandex/callback") return await yandexAuthCallback(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/yandex/complete") return completeYandexAuth(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/logout") return logoutSession(request, env);

      if (request.method === "GET" && url.pathname === "/health") {
        let schemaReady = false;
        let schemaVersion = null;
        if (env.DB) {
          try {
            await ensureSchema(env);
            const meta = await env.DB.prepare("SELECT value FROM wavero_meta WHERE key='schema_version' LIMIT 1").first();
            schemaVersion = meta?.value || null;
            schemaReady = schemaVersion === "1.0.5";
          } catch (error) {
            console.error("WAVERO_HEALTH_SCHEMA", { requestId, message: error?.message, stack: error?.stack });
          }
        }
        return json({
          ok: true,
          service: "wavero-api",
          version: "1.0.6-embedded-ui",
          schemaVersion,
          schemaReady,
          firebaseConfigured: Boolean(env.FIREBASE_API_KEY && env.FIREBASE_PROJECT_ID),
          yandexConfigured: Boolean(env.YANDEX_CLIENT_ID && env.YANDEX_CLIENT_SECRET),
          databaseConfigured: Boolean(env.DB),
        });
      }

      const isApi = url.pathname.startsWith("/api/") || url.pathname.startsWith("/mobile/") || url.pathname === "/directory";

      // Авторизация не должна зависеть от миграции дополнительных функций.
      if (request.method === "POST" && url.pathname === "/api/auth/register") return register(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/login") return login(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/refresh") return refreshSession(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/resend-verification") return resendVerification(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/reset-password") return resetPassword(request, env);
      if (request.method === "POST" && url.pathname === "/api/auth/sync") return syncAuthenticatedUser(request, env);

      // Вход в приложение и базовый список чатов имеют безопасный legacy-fallback.
      if (request.method === "GET" && url.pathname === "/api/bootstrap") return bootstrap(request, env);
      if (request.method === "GET" && url.pathname === "/api/me/chats") return listMyChats(request, env);

      // Дополнительная схема создаётся только после успешной авторизации.
      if (isApi) await ensureSchema(env);
      if (request.method === "GET" && url.pathname === "/api/me/profile") return getMyProfile(request, env);
      if (request.method === "PATCH" && url.pathname === "/api/me/profile") return updateMyProfile(request, env);
      if (request.method === "GET" && url.pathname === "/api/me/blocks") return listBlocks(request, env);

      const unblockMatch = url.pathname.match(/^\/api\/me\/blocks\/([^/]+)\/unblock$/);
      if (unblockMatch && request.method === "POST") return unblockUser(request, env, decodeURIComponent(unblockMatch[1]));

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
      if (request.method === "GET" && !isApiPath) return html(indexHtml);
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
      const failedPath = new URL(request.url).pathname;
      if (failedPath === "/api/auth/yandex/callback") {
        const clearCookie = `${YANDEX_STATE_COOKIE}=; Max-Age=0; Path=/api/auth/yandex/callback; HttpOnly; Secure; SameSite=Lax`;
        return redirectToApp(
          request,
          { yandex_error: String(code || "yandex_internal").toLowerCase(), request_id: requestId },
          { "Set-Cookie": clearCookie }
        );
      }
      if (error instanceof ApiError) return json({ ok: false, code: error.code, error: error.message, request_id: requestId }, error.status);
      return json({ ok: false, code: "INTERNAL_ERROR", error: "Внутренняя ошибка сервера.", request_id: requestId }, 500);
    }
  },
};


const YANDEX_CALLBACK_FALLBACK = "https://wavero-api.zachemposmotrel.workers.dev/api/auth/yandex/callback";
const YANDEX_STATE_COOKIE = "wvr_yandex_state";
const OAUTH_SESSION_SECONDS = 30 * 24 * 60 * 60;
const OAUTH_TICKET_SECONDS = 180;

async function startYandexAuth(request, env) {
  if (!env.YANDEX_CLIENT_ID || !env.YANDEX_CLIENT_SECRET) {
    return redirectToApp(request, { yandex_error: "not_configured" });
  }

  const state = randomToken(32);
  const redirectUri = yandexRedirectUri(env);
  const authorize = new URL("https://oauth.yandex.ru/authorize");
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", env.YANDEX_CLIENT_ID);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("force_confirm", "yes");

  return redirectResponse(authorize.toString(), {
    "Set-Cookie": `${YANDEX_STATE_COOKIE}=${state}; Max-Age=600; Path=/api/auth/yandex/callback; HttpOnly; Secure; SameSite=Lax`,
  });
}

async function yandexAuthCallback(request, env) {
  const url = new URL(request.url);
  const clearCookie = `${YANDEX_STATE_COOKIE}=; Max-Age=0; Path=/api/auth/yandex/callback; HttpOnly; Secure; SameSite=Lax`;

  try {
    if (!env.YANDEX_CLIENT_ID || !env.YANDEX_CLIENT_SECRET) {
      return redirectToApp(request, { yandex_error: "not_configured" }, { "Set-Cookie": clearCookie });
    }

    const oauthError = clean(url.searchParams.get("error"));
    if (oauthError) {
      const mapped = oauthError === "access_denied" ? "access_denied" : "oauth_rejected";
      return redirectToApp(request, { yandex_error: mapped }, { "Set-Cookie": clearCookie });
    }

    const code = clean(url.searchParams.get("code"));
    const returnedState = clean(url.searchParams.get("state"));
    const expectedState = clean(readCookie(request, YANDEX_STATE_COOKIE));
    if (!code || !returnedState || !expectedState || returnedState !== expectedState) {
      return redirectToApp(request, { yandex_error: "state_mismatch" }, { "Set-Cookie": clearCookie });
    }

    await ensureSchema(env);
    const oauthToken = await exchangeYandexCode(env, code);
    const profile = await fetchYandexProfile(env, oauthToken);
    const user = await findOrCreateYandexUser(env, profile);
    const issued = await issueWaveroAccessSession(env, user.id, "yandex");
    const ticket = randomToken(32);
    const ticketHash = await sha256Hex(ticket);
    const now = new Date();
    const ticketExpiresAt = new Date(now.getTime() + OAUTH_TICKET_SECONDS * 1000).toISOString();

    await env.DB.batch([
      env.DB.prepare(`DELETE FROM wavero_oauth_tickets WHERE expires_at <= ?1 OR used_at IS NOT NULL`).bind(now.toISOString()),
      env.DB.prepare(`
        INSERT INTO wavero_oauth_tickets (ticket_hash, access_token, expires_at, used_at)
        VALUES (?1, ?2, ?3, NULL)
      `).bind(ticketHash, issued.token, ticketExpiresAt),
    ]);

    return redirectToApp(request, { yandex_ticket: ticket }, { "Set-Cookie": clearCookie });
  } catch (error) {
    console.error("YANDEX_AUTH_ERROR", {
      code: error instanceof ApiError ? error.code : "YANDEX_INTERNAL",
      message: error?.message,
      stack: error?.stack,
    });
    const errorCode = error instanceof ApiError ? error.code : "YANDEX_INTERNAL";
    return redirectToApp(request, { yandex_error: errorCode.toLowerCase() }, { "Set-Cookie": clearCookie });
  }
}

async function completeYandexAuth(request, env) {
  await ensureSchema(env);
  const body = await readJson(request);
  const ticket = clean(body.ticket);
  if (!ticket) throw new ApiError(400, "Не найден код завершения входа.", "YANDEX_TICKET_MISSING");

  const ticketHash = await sha256Hex(ticket);
  const now = new Date().toISOString();
  const row = await env.DB.prepare(`
    SELECT access_token, expires_at, used_at
    FROM wavero_oauth_tickets
    WHERE ticket_hash = ?1
    LIMIT 1
  `).bind(ticketHash).first();

  if (!row || row.used_at || String(row.expires_at) <= now) {
    throw new ApiError(401, "Ссылка входа устарела. Повторите вход через Яндекс.", "YANDEX_TICKET_EXPIRED");
  }

  const consumed = await env.DB.prepare(`
    UPDATE wavero_oauth_tickets
    SET used_at = ?2
    WHERE ticket_hash = ?1 AND used_at IS NULL AND expires_at > ?2
  `).bind(ticketHash, now).run();
  if (!Number(consumed?.meta?.changes || 0)) {
    throw new ApiError(401, "Ссылка входа уже использована.", "YANDEX_TICKET_USED");
  }

  const sessionHash = await sha256Hex(row.access_token);
  const session = await env.DB.prepare(`
    SELECT expires_at
    FROM wavero_access_sessions
    WHERE token_hash = ?1 AND revoked_at IS NULL AND expires_at > ?2
    LIMIT 1
  `).bind(sessionHash, now).first();
  if (!session) throw new ApiError(401, "Сессия входа недоступна.", "YANDEX_SESSION_MISSING");

  const expiresIn = Math.max(1, Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000));
  return json({
    ok: true,
    id_token: row.access_token,
    refresh_token: null,
    expires_in: expiresIn,
    auth_provider: "yandex",
  });
}

async function logoutSession(request, env) {
  const token = bearerToken(request);
  if (token?.startsWith("wvr_")) {
    await ensureSchema(env);
    const hash = await sha256Hex(token);
    await env.DB.prepare(`
      UPDATE wavero_access_sessions
      SET revoked_at = COALESCE(revoked_at, ?2)
      WHERE token_hash = ?1
    `).bind(hash, new Date().toISOString()).run();
  }
  return json({ ok: true });
}

async function exchangeYandexCode(env, code) {
  const response = await fetch("https://oauth.yandex.ru/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${btoa(`${env.YANDEX_CLIENT_ID}:${env.YANDEX_CLIENT_SECRET}`)}`,
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    console.error("YANDEX_TOKEN_EXCHANGE_ERROR", { status: response.status, error: data?.error, description: data?.error_description });
    throw new ApiError(401, "Яндекс не подтвердил вход. Повторите попытку.", "YANDEX_TOKEN_EXCHANGE");
  }
  return data.access_token;
}

async function fetchYandexProfile(env, oauthToken) {
  const response = await fetch("https://login.yandex.ru/info?format=json", {
    headers: {
      "Authorization": `OAuth ${oauthToken}`,
      "Accept": "application/json",
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.id) {
    console.error("YANDEX_PROFILE_ERROR", { status: response.status, error: data?.error });
    throw new ApiError(401, "Не удалось получить профиль Яндекс ID.", "YANDEX_PROFILE_FAILED");
  }
  if (data.client_id && String(data.client_id) !== String(env.YANDEX_CLIENT_ID)) {
    throw new ApiError(401, "Профиль получен для другого приложения.", "YANDEX_CLIENT_MISMATCH");
  }
  return data;
}

async function findOrCreateYandexUser(env, profile) {
  const now = new Date().toISOString();
  const providerUserId = clean(profile.psuid || String(profile.id));
  const providerLogin = clean(profile.login).toLowerCase();
  const providerEmail = clean(profile.default_email || profile.emails?.[0]).toLowerCase();
  const email = providerEmail || `yandex-${String(profile.id).replace(/[^0-9a-z_-]/gi, "")}@oauth.wavero.local`;
  const displayName = clean(profile.real_name || profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || providerLogin || "Пользователь Яндекса").slice(0, 50);
  const avatarUrl = !profile.is_avatar_empty && clean(profile.default_avatar_id)
    ? `https://avatars.yandex.net/get-yapic/${encodeURIComponent(profile.default_avatar_id)}/islands-200`
    : "";

  if (!providerUserId) throw new ApiError(401, "Яндекс не вернул идентификатор пользователя.", "YANDEX_ID_MISSING");

  let user = await env.DB.prepare(`
    SELECT u.id, u.firebase_uid, u.email, u.username, u.display_name, u.role, u.status
    FROM wavero_oauth_identities i
    JOIN users u ON u.id = i.user_id
    WHERE i.provider = 'yandex' AND i.provider_user_id = ?1
    LIMIT 1
  `).bind(providerUserId).first();

  if (!user && providerEmail) {
    user = await env.DB.prepare(`
      SELECT id, firebase_uid, email, username, display_name, role, status
      FROM users
      WHERE email_normalized = ?1
      LIMIT 1
    `).bind(providerEmail).first();
  }

  if (user) {
    if (user.status === "suspended" || user.status === "deleted") {
      throw new ApiError(403, "Аккаунт Wavero заблокирован.", "ACCOUNT_UNAVAILABLE");
    }
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO wavero_oauth_identities (
          provider, provider_user_id, user_id, provider_login, provider_email, created_at, updated_at
        ) VALUES ('yandex', ?1, ?2, ?3, ?4, ?5, ?5)
        ON CONFLICT(provider, provider_user_id) DO UPDATE SET
          user_id = excluded.user_id,
          provider_login = excluded.provider_login,
          provider_email = excluded.provider_email,
          updated_at = excluded.updated_at
      `).bind(providerUserId, user.id, providerLogin, providerEmail, now),
      env.DB.prepare(`
        UPDATE users
        SET email_verified_at = COALESCE(email_verified_at, ?2),
            last_seen_at = ?2,
            updated_at = ?2,
            status = CASE WHEN status = 'pending_verification' THEN 'active' ELSE status END
        WHERE id = ?1
      `).bind(user.id, now),
      env.DB.prepare(`
        INSERT INTO wavero_profiles (user_id, bio, avatar_url, theme, sound_enabled, notifications_enabled, updated_at)
        VALUES (?1, '', ?2, 'dark', 1, 1, ?3)
        ON CONFLICT(user_id) DO UPDATE SET
          avatar_url = CASE WHEN wavero_profiles.avatar_url = '' THEN excluded.avatar_url ELSE wavero_profiles.avatar_url END,
          updated_at = excluded.updated_at
      `).bind(user.id, avatarUrl, now),
    ]);
    return { ...user, status: user.status === "pending_verification" ? "active" : user.status };
  }

  const userId = crypto.randomUUID();
  const username = await uniqueYandexUsername(env, providerLogin, String(profile.id));
  const firebaseUid = `yandex:${providerUserId}`;

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO users (
        id, firebase_uid, email, email_normalized, email_verified_at,
        username, username_normalized, display_name, password_hash,
        role, status, last_seen_at, created_at, updated_at
      ) VALUES (
        ?1, ?2, ?3, ?3, ?4,
        ?5, ?5, ?6, 'oauth_yandex',
        'user', 'active', ?4, ?4, ?4
      )
    `).bind(userId, firebaseUid, email, now, username, displayName),
    env.DB.prepare(`
      INSERT INTO wavero_oauth_identities (
        provider, provider_user_id, user_id, provider_login, provider_email, created_at, updated_at
      ) VALUES ('yandex', ?1, ?2, ?3, ?4, ?5, ?5)
    `).bind(providerUserId, userId, providerLogin, providerEmail, now),
    env.DB.prepare(`
      INSERT INTO wavero_profiles (user_id, bio, avatar_url, theme, sound_enabled, notifications_enabled, updated_at)
      VALUES (?1, '', ?2, 'dark', 1, 1, ?3)
      ON CONFLICT(user_id) DO NOTHING
    `).bind(userId, avatarUrl, now),
    env.DB.prepare(`
      INSERT OR IGNORE INTO chat_members (chat_id, user_id, role, joined_at)
      VALUES ('system-channel-wavero', ?1, 'subscriber', ?2)
    `).bind(userId, now),
  ]);

  return {
    id: userId,
    firebase_uid: firebaseUid,
    email,
    username,
    display_name: displayName,
    role: "user",
    status: "active",
  };
}

async function uniqueYandexUsername(env, login, providerId) {
  let base = clean(login)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 18);
  if (base.length < 4) base = `ya_${String(providerId).replace(/[^a-z0-9]/gi, "").slice(-10).toLowerCase()}`;
  if (base.length < 4) base = `ya_${randomToken(6).toLowerCase()}`;
  const reserved = new Set(["admin", "administrator", "moderator", "support", "system", "security", "wavero"]);
  if (reserved.has(base)) base = `ya_${base}`.slice(0, 18);

  for (let index = 0; index < 40; index += 1) {
    const suffix = index === 0 ? "" : `_${index + 1}`;
    const candidate = `${base.slice(0, 24 - suffix.length)}${suffix}`;
    const exists = await env.DB.prepare(`
      SELECT 1 AS found FROM users WHERE username_normalized = ?1 LIMIT 1
    `).bind(candidate).first();
    if (!exists) return candidate;
  }
  return `ya_${randomToken(12).toLowerCase()}`.replace(/[^a-z0-9_]/g, "_").slice(0, 24);
}

async function issueWaveroAccessSession(env, userId, provider) {
  const token = `wvr_${randomToken(48)}`;
  const tokenHash = await sha256Hex(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OAUTH_SESSION_SECONDS * 1000).toISOString();
  await env.DB.prepare(`
    INSERT INTO wavero_access_sessions (
      token_hash, user_id, provider, created_at, expires_at, last_seen_at, revoked_at
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?4, NULL)
  `).bind(tokenHash, userId, provider, now.toISOString(), expiresAt).run();
  return { token, expiresAt };
}

async function authenticatedOauthUser(env, token) {
  await ensureSchema(env);
  const tokenHash = await sha256Hex(token);
  const now = new Date().toISOString();
  const user = await env.DB.prepare(`
    SELECT u.id, u.firebase_uid, u.email, u.username, u.display_name, u.role, u.status
    FROM wavero_access_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ?1
      AND s.revoked_at IS NULL
      AND s.expires_at > ?2
      AND COALESCE(u.status, 'active') = 'active'
    LIMIT 1
  `).bind(tokenHash, now).first();
  if (!user) throw new ApiError(401, "Сессия истекла. Войдите снова.", "SESSION_EXPIRED");
  return user;
}

function yandexRedirectUri(env) {
  return clean(env.YANDEX_REDIRECT_URI) || YANDEX_CALLBACK_FALLBACK;
}

function readCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  for (const part of cookie.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    if (key === name) return decodeURIComponent(part.slice(index + 1).trim());
  }
  return "";
}

function redirectToApp(request, params = {}, extraHeaders = {}) {
  const target = new URL("/", request.url);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") target.searchParams.set(key, String(value));
  }
  return redirectResponse(target.toString(), extraHeaders);
}

function redirectResponse(location, extraHeaders = {}) {
  return new Response(null, {
    status: 302,
    headers: {
      "Location": location,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

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
  if (idToken.startsWith("wvr_")) return authenticatedOauthUser(env, idToken);

  requireFirebase(env);
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
  try {
    await ensureSchema(env);
    const [profile, chats] = await Promise.all([
      loadProfile(env, user),
      queryMyChats(env, user),
    ]);
    return json({ ok: true, user, profile, settings: profile, chats, is_admin: isGlobalAdmin(user), extension_schema_ready: true });
  } catch (error) {
    console.error("WAVERO_BOOTSTRAP_FALLBACK", { message: error?.message, stack: error?.stack });
    const profile = { bio: "", avatar_url: "", theme: "dark", sound_enabled: 1, notifications_enabled: 1, updated_at: null };
    const chats = await queryMyChatsLegacy(env, user);
    return json({ ok: true, user, profile, settings: profile, chats, is_admin: isGlobalAdmin(user), extension_schema_ready: false });
  }
}

async function listMyChats(request, env) {
  const user = await authenticatedD1User(request, env);
  try {
    await ensureSchema(env);
    return json({ ok: true, user, chats: await queryMyChats(env, user), extension_schema_ready: true });
  } catch (error) {
    console.error("WAVERO_CHATS_FALLBACK", { message: error?.message, stack: error?.stack });
    return json({ ok: true, user, chats: await queryMyChatsLegacy(env, user), extension_schema_ready: false });
  }
}

async function queryMyChatsLegacy(env, user) {
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
      0 AS archived,
      0 AS muted,
      (SELECT m.text FROM messages m WHERE m.chat_id=c.id AND m.deleted_at IS NULL AND m.deleted_for_everyone=0 ORDER BY m.created_at DESC LIMIT 1) AS last_message,
      (SELECT m.created_at FROM messages m WHERE m.chat_id=c.id AND m.deleted_at IS NULL AND m.deleted_for_everyone=0 ORDER BY m.created_at DESC LIMIT 1) AS last_message_at,
      0 AS unread_count,
      (SELECT COUNT(*) FROM chat_members members WHERE members.chat_id=c.id AND members.left_at IS NULL AND members.is_banned=0) AS member_count
    FROM chat_members cm
    INNER JOIN chats c ON c.id=cm.chat_id
    WHERE cm.user_id=?1 AND cm.left_at IS NULL AND cm.is_banned=0 AND c.deleted_at IS NULL
    ORDER BY COALESCE(last_message_at,c.updated_at,c.created_at) DESC
  `).bind(user.id).all();
  return result.results || [];
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
  const user = await authenticatedD1User(request, env);
  const result = await env.DB.prepare(`
    DELETE FROM wavero_blocks_v1
    WHERE blocker_user_id = ?1 AND blocked_user_id = ?2
  `).bind(user.id, targetId).run();
  return json({ ok: true, blocked: false, removed: Number(result.meta?.changes || 0) > 0 });
}

async function createChat(request, env) {
  const user = await authenticatedD1User(request, env);
  const body = await readJson(request);
  const type = clean(body.type);
  if (!['group', 'channel'].includes(type)) {
    throw new ApiError(400, "Можно создать только группу или канал.", "CHAT_TYPE_INVALID");
  }

  const title = clean(body.title).replace(/\s+/g, ' ');
  const description = clean(body.description).slice(0, 500);
  const isPublic = body.is_public ? 1 : 0;
  const username = clean(body.username).normalize('NFKC').toLowerCase().replace(/^@+/, '');
  const kind = type === 'channel' ? 'канала' : 'группы';

  if (title.length < 2 || title.length > 80) {
    throw new ApiError(400, "Название должно содержать от 2 до 80 символов.", "CHAT_TITLE_INVALID");
  }
  if (username && !/^[a-z0-9_]{4,32}$/.test(username)) {
    throw new ApiError(400, "Username: 4–32 символа, латинские буквы, цифры и _.", "CHAT_USERNAME_INVALID");
  }
  if (isPublic && !username) {
    throw new ApiError(400, `Для публичного ${kind} укажите username.`, "CHAT_USERNAME_REQUIRED");
  }
  if (username) {
    const conflict = await env.DB.prepare(`
      SELECT id FROM chats
      WHERE username_normalized = ?1 AND deleted_at IS NULL
      LIMIT 1
    `).bind(username).first();
    if (conflict) throw new ApiError(409, "Этот username уже занят.", "CHAT_USERNAME_TAKEN");
  }

  const chatId = crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO chats (
          id, type, title, username, username_normalized, description,
          owner_user_id, is_system, is_public, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?4, ?5, ?6, 0, ?7, ?8, ?8)
      `).bind(chatId, type, title, username || null, description, user.id, isPublic, now),
      env.DB.prepare(`
        INSERT INTO chat_members (chat_id, user_id, role, joined_at)
        VALUES (?1, ?2, 'owner', ?3)
      `).bind(chatId, user.id, now),
    ]);
  } catch (error) {
    console.error('CHAT_CREATE_DB_ERROR', {
      type,
      isPublic,
      hasUsername: Boolean(username),
      message: error?.message,
      stack: error?.stack,
    });
    const message = String(error?.message || '');
    if (/UNIQUE constraint failed: chats\.(username|username_normalized)/i.test(message)) {
      throw new ApiError(409, "Этот username уже занят.", "CHAT_USERNAME_TAKEN");
    }
    throw new ApiError(500, `Не удалось создать ${kind}.`, "CHAT_CREATE_DB_FAILED");
  }

  return json({
    ok: true,
    created: true,
    chat_id: chatId,
    chat: { id: chatId, type, title, username: username || null, description, is_public: isPublic, role: 'owner', member_count: 1 },
  }, 201);
}

async function getChat(request, env, chatId) {
  const user = await authenticatedD1User(request, env);
  const membership = await ensureChatAccess(env, chatId, user.id);
  const [members, pins] = await Promise.all([
    queryChatMembers(env, chatId),
    env.DB.prepare(`
      SELECT pm.message_id, pm.pinned_at, m.text, u.display_name AS sender_display_name
      FROM wavero_pinned_messages pm
      INNER JOIN messages m ON m.id = pm.message_id
      LEFT JOIN users u ON u.id = m.sender_user_id
      WHERE pm.chat_id = ?1
      ORDER BY pm.pinned_at DESC
      LIMIT 20
    `).bind(chatId).all(),
  ]);

  let peerUserId = null;
  let peerBlockedByMe = 0;
  if (membership.type === 'private') {
    const peer = await env.DB.prepare(`
      SELECT cm.user_id
      FROM chat_members cm
      WHERE cm.chat_id = ?1 AND cm.user_id <> ?2 AND cm.left_at IS NULL
      LIMIT 1
    `).bind(chatId, user.id).first();
    peerUserId = peer?.user_id || null;
    if (peerUserId) {
      const blocked = await env.DB.prepare(`
        SELECT 1 AS blocked
        FROM wavero_blocks_v1
        WHERE blocker_user_id = ?1 AND blocked_user_id = ?2
        LIMIT 1
      `).bind(user.id, peerUserId).first();
      peerBlockedByMe = blocked ? 1 : 0;
    }
  }

  return json({
    ok: true,
    chat: { ...membership, peer_user_id: peerUserId, peer_blocked_by_me: peerBlockedByMe },
    members,
    pins: pins.results || [],
  });
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
  const user = await authenticatedD1User(request, env);
  const membership = await ensureChatAccess(env, chatId, user.id);
  if (!canManageChat(membership.role)) {
    throw new ApiError(403, "Добавлять участников могут владелец и администратор.", "MEMBER_ADD_DENIED");
  }
  if (membership.type === 'private') {
    throw new ApiError(400, "В личный диалог нельзя добавлять других пользователей. Создайте группу.", "PRIVATE_MEMBER_ADD_DENIED");
  }

  const body = await readJson(request);
  const targetId = clean(body.user_id);
  const targetUsername = clean(body.username).normalize('NFKC').toLowerCase().replace(/^@+/, '');
  if (!targetId && !targetUsername) {
    throw new ApiError(400, "Выберите пользователя.", "MEMBER_TARGET_REQUIRED");
  }

  const target = targetId
    ? await env.DB.prepare(`SELECT id, username, display_name FROM users WHERE id = ?1 AND status = 'active' LIMIT 1`).bind(targetId).first()
    : await env.DB.prepare(`SELECT id, username, display_name FROM users WHERE username_normalized = ?1 AND status = 'active' LIMIT 1`).bind(targetUsername).first();
  if (!target) throw new ApiError(404, "Пользователь не найден.", "USER_NOT_FOUND");
  if (target.id === user.id) throw new ApiError(409, "Вы уже состоите в этом чате.", "MEMBER_ALREADY_JOINED");

  const blocked = await env.DB.prepare(`
    SELECT 1 AS blocked
    FROM wavero_blocks_v1
    WHERE (blocker_user_id = ?1 AND blocked_user_id = ?2)
       OR (blocker_user_id = ?2 AND blocked_user_id = ?1)
    LIMIT 1
  `).bind(user.id, target.id).first();
  if (blocked) throw new ApiError(409, "Сначала снимите блокировку между пользователями.", "MEMBER_BLOCKED");

  const existing = await env.DB.prepare(`
    SELECT left_at, is_banned
    FROM chat_members
    WHERE chat_id = ?1 AND user_id = ?2
    LIMIT 1
  `).bind(chatId, target.id).first();
  if (existing && !existing.left_at && Number(existing.is_banned || 0) === 0) {
    throw new ApiError(409, "Этот пользователь уже состоит в чате.", "MEMBER_ALREADY_JOINED");
  }

  const role = membership.type === 'channel' ? 'subscriber' : 'member';
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE chat_members
      SET role = ?1, left_at = NULL, is_banned = 0, joined_at = ?2
      WHERE chat_id = ?3 AND user_id = ?4
    `).bind(role, now, chatId, target.id),
    env.DB.prepare(`
      INSERT OR IGNORE INTO chat_members (chat_id, user_id, role, joined_at)
      VALUES (?1, ?2, ?3, ?4)
    `).bind(chatId, target.id, role, now),
  ]);
  return json({ ok: true, added: true, member: { ...target, role } });
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
