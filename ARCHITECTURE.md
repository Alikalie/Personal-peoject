# Betting Platform Architecture & Flows

This document describes how the React frontend connects to Supabase and PostgreSQL, the authentication and admin flows, database tables, and example code snippets to implement common CRUD operations.

## Overview

Flow (high level):

Admin/User
  ↓
React Frontend (browser)
  ↓
Supabase Client (`src/lib/supabase.js`)
  ↓
Supabase API (auth, Postgres, RLS)
  ↓
PostgreSQL Database

## 1. Frontend connects to Supabase

File: `src/lib/supabase.js`

Example:

```js
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

This client is used across services (`src/services/*.js`) to call `.from()` and auth methods.

## 2. Environment variables

File: `.env` (or `.env.local`)

Example:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_KEY=your_service_role_key  # optional, server use only
```

React with Vite reads `VITE_` prefixed variables automatically.

File added to repository: `.env.example`

## 3. Database tables (summary)

Table        | Purpose
-------------|---------------------------
profiles     | users and admin profiles
matches      | football matches
daily_predictions | active tips for the day
past_predictions  | archived/finished tips
vip_plans    | VIP subscription plans
vip_requests | user requests for VIP
comments     | user comments
likes        | likes/reactions
contact_messages | support inbox
footer_contacts   | footer CMS content
site_settings     | site-wide CMS and flags

## 4. User authentication flow

REGISTER (frontend):

```js
await supabase.auth.signUp({ email, password })
```

Supabase creates the auth account in `auth.users`. Use a Postgres trigger/function to create a `profiles` row on user creation.

LOGIN (frontend):

```js
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
// `data.session` and `data.user` are returned
```

Store/rely on `supabase.auth.getUser()` and `supabase.auth.onAuthStateChange()` in the app to track sessions.

## 5. Role system

Keep a `role` field inside `profiles` (e.g., `user`, `admin`, `super_admin`). The frontend checks the profile before granting access to admin routes.

Example check:

```js
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .maybeSingle()

if (profile?.role === 'admin' || profile?.role === 'super_admin') {
  navigate('/admin/dashboard')
}
```

## 6. Admin CRUD examples

ADD MATCH (frontend):

```js
await supabase.from('matches').insert({
  country,
  home_team,
  away_team,
  competition,
  match_day,
  match_time,
})
```

FETCH MATCHES:

```js
const { data: matches } = await supabase.from('matches').select('*')
```

DAILY PREDICTION (linking matches):

```js
await supabase.from('daily_predictions').insert({
  country,
  match_1_id,
  match_2_id,
  prediction,
  odds,
})
```

To fetch linked match info in a single query:

```js
const { data } = await supabase
  .from('daily_predictions')
  .select(`
    *,
    match_1:matches!daily_predictions_match_1_id_fkey(*),
    match_2:matches!daily_predictions_match_2_id_fkey(*)
  `)
```

Returned JSON will include `match_1` and `match_2` objects.

ARCHIVE DAILY → PAST:

```js
await supabase.from('past_predictions').insert({ prediction, odds, result })
await supabase.from('daily_predictions').delete().eq('id', id)
```

VIP approval example (admin):

```js
await supabase.from('profiles').update({ is_vip: true }).eq('id', userId)
```

CONTACT FORM (user):

```js
await supabase.from('contact_messages').insert({ name, email, subject, message })
```

FOOTER CMS (admin updates):

```js
await supabase.from('footer_contacts').update({ company_name, contact_email }).eq('id', 1)
```

SITE SETTINGS (enable login):

```js
await supabase.from('site_settings').update({ allow_login: true }).eq('id', 1)
```

Frontend should check settings before rendering login/register:

```js
if (!settings?.allow_login) return <div>Login is currently disabled</div>
```

## 7. Row Level Security (RLS)

Use RLS to enforce permissions server-side. Example pseudo-policy for inserts by admins:

```sql
-- only allow inserts to matches if caller is admin
create policy "admin insert matches" on public.matches
  for insert using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
```

Ensure functions like `is_admin()` or a `public.admin_users` table are available and used in policies.

## 8. SQL snippets: create admin users

Grant admin role to existing auth users by email:

```sql
INSERT INTO public.admin_users (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email IN ('admin@example.com')
ON CONFLICT (user_id) DO NOTHING;

-- or directly update profiles
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

## 9. Why this structure

- Scalable: client-only app with Supabase scales with Postgres.
- Secure: RLS keeps enforcement at the DB layer.
- Fast dev: auth + DB + realtime + storage managed by Supabase.

## 10. Next steps (recommended)

1. Implement full CRUD for one admin section (e.g., Matches) as a template.  
2. Wire UI components under `src/pages/admin/*` to `src/services/*` using the `supabase` client.  
3. Add unit/integration tests for services.  
4. Run SQL migrations in Supabase: apply `sql/005_predictions_restructure.sql`, `sql/007_site_settings_flags.sql`, and `sql/008_enable_login.sql`.  
5. Deploy: host the frontend (Vercel/Netlify) and configure domain + Supabase production DB.

---

Files added:

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [.env.example](.env.example)
