# MU Startup Hub

แพลตฟอร์มดิจิทัลของ **Mahidol Startup Club** — รวมเว็บชมรม, PR CMS (no-code) และ Business Matching Hub

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Supabase (Auth, PostgreSQL, Storage, RLS)
- **Editor:** TipTap (Rich text CMS)
- **State:** TanStack Query + Zustand

## Features

- Public website (หน้าแรก, กิจกรรม, ข่าวสาร, เกี่ยวกับเรา)
- **PR CMS** — ทีม PR สร้าง/แก้ไขข่าวและกิจกรรมได้โดยไม่ต้องเขียนโค้ด
- **Match Hub** — Business matching ระหว่าง startup, mentor, partner (ในและนอกมหิดล)
- Connection requests + notifications
- Admin panel + role management (member, pr, core_team, admin)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create Supabase project

1. สร้าง project ที่ [supabase.com](https://supabase.com)
2. รัน migration ใน SQL Editor:

```bash
# หรือใช้ Supabase CLI
supabase db push
```

ไฟล์ migration: `supabase/migrations/20260707000000_initial_schema.sql`

### 3. Create Storage bucket

ใน Supabase Dashboard → Storage → สร้าง bucket ชื่อ `media` (public)

### 4. Environment variables

```bash
cp .env.example .env
```

แก้ไข `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run dev server

```bash
npm run dev
```

### 6. Set admin role

หลังสมัครสมาชิก ให้ตั้ง role ใน Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-uuid';
```

## Project Structure

```
src/
├── components/     # UI, layout, CMS, matching
├── contexts/       # Auth context
├── lib/            # Supabase client, utils, constants
├── pages/          # Public, match, admin, auth
├── routes/         # Protected & role routes
└── types/          # TypeScript types
supabase/
└── migrations/     # Database schema + RLS
```

## Deployment

```bash
npm run build
```

Deploy `dist/` ไป Vercel/Netlify และตั้ง env vars เดียวกับ `.env`

## License

MIT — Mahidol Startup Club
