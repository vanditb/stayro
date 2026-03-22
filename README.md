# Stayro

Stayro is an AI-powered website generator for short-term rental hosts. Hosts can paste an Airbnb or Vrbo URL, or enter their property details manually, then generate a polished direct-booking website, review booking requests, block dates, and upgrade to Pro for custom domain support.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth credentials auth
- Stripe subscriptions for Pro
- Resend transactional email
- OpenAI structured content generation
- iCal import support
- Zod validation

## Architecture

- `app/(marketing)` contains the homepage, pricing, features, demo, auth, and legal pages.
- `app/(dashboard)` contains the authenticated host dashboard, onboarding/editor, bookings, calendar, billing, and settings pages.
- `app/_sites/[slug]` renders published public property websites and `app/preview/[slug]` renders previewable property sites.
- `lib/actions` contains server actions for auth, property creation/publishing, and booking/calendar operations.
- `lib/data` contains marketing content, fallback demo data, and data query helpers.
- `lib/ai`, `lib/email`, `lib/billing`, and `lib/calendar` isolate integration logic.
- `prisma/schema.prisma` defines the MVP data model and `prisma/seed.ts` seeds a polished demo account and property.

## Core MVP Features

- Premium marketing site for Stayro
- Auth flow for host signup/sign-in
- Multi-step onboarding and structured editor
- AI-generated first-draft content stored in the database
- Public direct-booking property websites
- Request-to-book workflow with guest and host emails
- Host booking inbox with approve/decline
- Auto-block dates after approval
- Manual blocked-date controls
- iCal import endpoint
- Free and Pro plans with Stripe checkout/portal endpoints
- Stayro subdomain + custom domain management flow
- Basic analytics cards and traffic snapshot
- Seeded demo account and demo property site

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values you need:

```bash
cp .env.example .env.local
```

Required for local app boot:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `APP_URL`

Optional integrations:

- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_PRICE_ID`
- `RESEND_API_KEY`
- `RESEND_FROM`

If `OPENAI_API_KEY`, Stripe, or Resend are missing, the app falls back gracefully:

- AI generation uses a deterministic local fallback generator
- email sends are logged instead of delivered
- billing pages still render, but checkout/portal routes redirect back without starting Stripe sessions

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Generate Prisma client.

```bash
npx prisma generate
```

3. Run a migration against your PostgreSQL database.

```bash
npx prisma migrate dev --name init
```

4. Seed the demo data.

```bash
npm run prisma:seed
```

5. Start the app.

```bash
npm run dev
```

## Demo Seed

After seeding, you can sign in with:

- Email: `demo@stayro.co`
- Password: `stayro-demo`

Seeded content includes:

- 1 demo host account
- 1 published demo property: `Oceancrest House`
- realistic placeholder photos
- generated site copy
- mixed booking request statuses
- blocked dates and an iCal feed record
- published preview page at `/preview/oceancrest-house`

## Stripe Notes

- The Free plan does not require payment details.
- The Pro plan uses a single Stripe subscription price ID from `STRIPE_PRO_PRICE_ID`.
- `/api/stripe/webhook` upgrades the subscription record to Pro when checkout completes.

## Build + Validation

Validated locally in this workspace with:

```bash
npx prisma generate
npx tsc --noEmit
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/stayro' \
DIRECT_URL='postgresql://postgres:postgres@localhost:5432/stayro' \
NEXTAUTH_SECRET='dev-secret' \
NEXTAUTH_URL='http://localhost:3000' \
APP_URL='http://localhost:3000' \
npm run build
```

The production build succeeds. During build, Prisma will log a database connection warning if no local PostgreSQL server is running, but the build still completes because non-essential generated routes are guarded.
