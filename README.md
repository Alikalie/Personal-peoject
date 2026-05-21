
# Betting Platform

A lightweight React + Vite betting platform with a public-facing site and an admin dashboard. Data persistence and authentication are handled via Supabase.

## Table of contents

- Quickstart
- Environment
- Database / Supabase
- Features
- Project structure
- Scripts
- Deployment
- Contributing
- License

## Quickstart

Prerequisites:
- Node.js 18+ (or compatible)
- npm or yarn
- A Supabase project (for database and auth)

1. Install dependencies

```bash
npm install
```

2. Create environment variables

Create a file named `.env` (or use your preferred Vite env mechanism) at the project root and set at minimum:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run development server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
npm run preview
```

## Environment variables

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — the anon/public key for Supabase

Other env vars may be read by utilities or local scripts; check `src/lib/supabase.js` and the `sql/` scripts for additional requirements.

## Database / Supabase

The project uses Supabase for storing site settings, matches, predictions, VIP plans, users, and messages. SQL helper scripts are provided under the `sql/` directory to create the required schema and initial admin user.

- See `sql/001_create_schema.sql`, `sql/002_setup_admin_user.sql`, `sql/003_setup_admin_profile.sql`, and `sql/004_auto_super_admin.sql` for schema and bootstrap steps.
- See [DATABASE_SETUP.md](DATABASE_SETUP.md) and [ADMIN_SETUP.md](ADMIN_SETUP.md) for step-by-step instructions.

Required tables (examples): `site_settings`, `contact_messages`, `leagues`, `matches`, `vip_plans`, plus the standard Supabase `auth` tables.

## Features

- Public site: Home, Predictions, VIP, Leagues, Contact, Terms & Privacy
- Admin dashboard: manage matches, predictions, users, messages, VIP plans, and site settings
- Supabase-backed CRUD operations for matches, leagues, VIP plans, messages, and settings
- Admin-controlled navigation and content (toggle pages, update footer/support contacts)

## Supported data

This project exposes and persists the following primary data types:

- MATCHES
  - fields: `country`, `home_team`, `away_team`

- DAILY PREDICTIONS
  - fields: `match_1`, `match_2`, `prediction`, `odds`

- PAST / ARCHIVED PREDICTIONS
  - archived entries include: `results`, `odds`, `history`
  - note: archived prediction records are stored without a timestamp by design

## Project structure (high level)

- `src/` — application source
  - `pages/` — route pages (public, auth, admin, user)
  - `components/` — UI components, forms, layout pieces
  - `services/` — API/service wrappers (Supabase calls)
  - `lib/supabase.js` — Supabase client initialization
- `public/` — static assets
- `sql/` — database schema and setup scripts
- `index.html`, `vite.config.js` — Vite entry and config

## Scripts

From `package.json`:

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Deployment

This app builds into static assets via Vite and can be deployed to any static host (Netlify, Vercel, Cloudflare Pages) with serverless functions or to a Node host if you need server middleware. Ensure your Supabase keys are stored securely in the host's environment.

## Troubleshooting

- If you see authentication or 401 errors, verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct and not expired.
- If tables are missing, run the SQL scripts under `sql/` to create schema and seed an admin user.

## Contributing

If you'd like to contribute:

1. Fork the repo and create a feature branch
2. Open a pull request with a clear description of changes

Please run `npm run lint` before submitting changes.

## Useful files

- `src/lib/supabase.js` — Supabase client
- `sql/` — DB schema and setup scripts
- `ADMIN_SETUP.md`, `DATABASE_SETUP.md` — admin and DB setup instructions

## License

MIT

