# Wavero

Wavero is a Cloudflare Workers messenger backed by D1. The current web client is
served by the Worker; email/password authentication uses Firebase Identity
Toolkit and Yandex ID uses a server-side OAuth flow.

## Source layout

- `index.html` is the only editable web UI source.
- `worker.js` contains the API and a generated embedded copy of `index.html`.
- `scripts/embed-ui.mjs` verifies or regenerates that embedded copy.
- `migrations/*.sql` are the ordered, one-time D1 migrations.
- `schema.sql` is generated from migrations for a fresh local/test database.

Do not edit the `indexHtml` declaration in `worker.js` manually. Run
`npm run build` after changing `index.html`.

## Local checks

```bash
npm install
npm run build
npm run check
npm run db:migrate:local
npx wrangler dev --local
```

The application never applies migrations during a user request. Apply each D1
migration once as a separate deployment step.

## Remote deployment order

```bash
npm ci
npm run check
npm run db:migrate:remote
npm run deploy
```

Do not put Cloudflare, Firebase, Yandex, or R2 credentials in this repository.
See `docs/deployment.md` for environment variables, rollout, and rollback.
