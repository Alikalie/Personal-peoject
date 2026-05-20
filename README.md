# Betting Platform

A React + Vite sports betting platform with public pages and an admin dashboard backed by Supabase.

## Features

- Public pages: home, predictions, VIP, leagues, contact
- Admin pages: dashboard, predictions, matches, leagues, users, messages, settings, VIP management
- Supabase CRUD for matches, leagues, VIP plans, site settings, and contact messages
- Admin-controlled navigation links: toggle Home, Predictions, VIP, Leagues, and Contact visibility
- Contact form persistence and admin message inbox
- Footer and public site navigation follow admin settings

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure Supabase:

- Create a `.env` file or use Vite env variables
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

3. Run the app:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Required Supabase Tables

The app expects the following tables:

- `site_settings`
  - `site_title`
  - `homepage_headline`
  - `vip_banner`
  - `footer_text`
  - `contact_header`
  - `contact_intro`
  - `contact_description`
  - `nav_home_enabled`
  - `nav_predictions_enabled`
  - `nav_vip_enabled`
  - `nav_leagues_enabled`
  - `nav_contact_enabled`
- `contact_messages`
  - `id`, `label`, `detail`, `icon`
- `contact_messages`
  - `id`, `name`, `email`, `subject`, `message`, `created_at`
- `leagues`
  - `id`, `name`, `country`, `status`, `icon_url`
- `matches`
  - `id`, `league_id`, `home_team`, `away_team`, `match_date`, `status`
- `vip_plans`
  - `id`, `name`, `price`, `status`, `description`

## Admin Settings

Visit `/admin/settings` to modify site content, support contacts, footer copy, and navigation visibility. When a nav item is disabled, it is hidden from users in the header and footer.

## Notes

- The contact page now uses `contact_header` to match the admin settings schema.
- The site falls back to default support contact entries if `contact_messages` is missing.
- Admin match and VIP pages now persist data to Supabase.

## Build

```bash
npm run build
```

## License

MIT
