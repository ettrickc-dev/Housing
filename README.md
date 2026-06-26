# PlainRights Court

New York State **landlord-tenant housing court** document preparation & legal
education platform. **Document prep and self-help only — not legal advice, not a
law firm, no attorney-client relationship.**

> Sibling project to the existing `plainrights` static guide. This is the paid,
> account-based, NY-housing-court-specific platform. Built per the zero-monthly-cost
> stack: Supabase + Netlify + Stripe + Resend.

## Stack

| Concern        | Tool                                   |
| -------------- | -------------------------------------- |
| Frontend       | React + Vite + Tailwind (Netlify)      |
| Backend logic  | Netlify Functions (Node, serverless)   |
| DB / Auth / Storage | Supabase (free tier)              |
| PDF generation | `@react-pdf/renderer` (client-side)    |
| Payments       | Stripe Checkout (+ webhook function)   |
| Email          | Resend                                 |

## Build progress (MVP order)

- [x] Step 1 — Scaffold + Supabase schema
- [x] Step 2 — Supabase Auth + profile UI
- [x] Step 3 — Intake wizard (role → location → housing type → need)
- [x] Step 4 — Landlord: 14-Day Rent Demand + Nonpayment Petition + Affidavit of Service
- [x] Step 5 — Tenant: Written Answer + OSC to Vacate Default
- [x] Step 6 — Stripe Checkout (Netlify Function + webhook) — per-document; subscriptions TODO
- [x] Step 7 — Resend email (reminders + admin alerts)
- [x] Step 8 — PDF polish + NYSCEF instruction page
- [x] Step 9 — Admin Law Review Dashboard
- [x] Step 10 — Termination/cure notices + court & clerk directory

**See `DEPLOYMENT.md` for the go-live guide and checklist.**

Documents currently live: 14-Day Rent Demand, Nonpayment Petition, Affidavit of
Service, 10-Day Notice to Cure, 30/60/90-Day Notice of Termination (landlord);
Written Answer (Nonpayment) with defenses, OSC to Vacate Default (tenant). More are
added on the same framework, each with statute review.

---

## Local setup

```bash
npm install
cp .env.example .env      # then fill in values (see checklist below)
npm run dev               # Vite frontend only, http://localhost:5173
# OR, to also run Netlify Functions locally:
# npm i -g netlify-cli && netlify dev   # http://localhost:8888
```

## Supabase setup

1. Create a free project at https://supabase.com/dashboard.
2. SQL Editor → run **`supabase/schema.sql`** (tables, RLS, storage bucket, triggers).
3. SQL Editor → run **`supabase/seed.sql`** (statutes catalog — all `last_verified_date` NULL until an admin verifies them).
4. Authentication → Providers → enable **Email** (Email/password). Google OAuth is deferred.
5. Make yourself admin (after you sign up):
   ```sql
   update public.profiles set is_admin = true where email = 'ettrickc@gmail.com';
   ```

## Credential checklist — where each value goes

| Value | Public? | Where to put it |
| ----- | ------- | --------------- |
| Supabase **Project URL** | public | `.env` → `VITE_SUPABASE_URL` + Netlify env |
| Supabase **anon key** | public | `.env` → `VITE_SUPABASE_ANON_KEY` + Netlify env |
| Supabase **service_role key** | **SECRET** | Netlify env only → `SUPABASE_SERVICE_ROLE_KEY` |
| Stripe **publishable key** | public | `.env` → `VITE_STRIPE_PUBLISHABLE_KEY` + Netlify env |
| Stripe **secret key** | **SECRET** | Netlify env only → `STRIPE_SECRET_KEY` |
| Stripe **webhook secret** | **SECRET** | Netlify env only → `STRIPE_WEBHOOK_SECRET` |
| Resend **API key** | **SECRET** | Netlify env only → `RESEND_API_KEY` |
| Admin email | n/a | `ADMIN_EMAIL=ettrickc@gmail.com` |

> **Never paste SECRET values into source, chat, or git.** They live only in
> Netlify (Site settings → Environment variables) and your local untracked `.env`.

## Legal positioning (non-negotiable)

- The verbatim disclaimer lives in `src/lib/constants.js` (`LEGAL_DISCLAIMER`) and
  must appear on every page, document, and email.
- Any document citing a statute also carries the statute footer note with the
  admin-managed **last law review date**.
- Statute citations and court form numbers in `supabase/seed.sql` are **unverified
  placeholders** pending admin review — confirm against current NY law before relying on them.
