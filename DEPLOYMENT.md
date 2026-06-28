# PlainRights Court — Deployment & Go-Live Guide

This app is built to run at near-zero monthly cost: **Netlify** (frontend +
functions), **Supabase** (DB/Auth/Storage), **Stripe** (per-transaction only),
**Resend** (email). Follow these steps to deploy and go live.

---

## 1. Push to GitHub

```bash
cd plainrights-court
git init
git add .
git commit -m "PlainRights Court initial"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/plainrights-court.git
git branch -M main
git push -u origin main
```

`.env` is gitignored — your secrets are NOT pushed. Good.

## 2. Connect Netlify

1. app.netlify.com → **Add new site → Import an existing project** → pick the repo.
2. Build settings are auto-detected from `netlify.toml` (build `npm run build`,
   publish `dist`, functions `netlify/functions`).
3. Deploy. Note your site URL (e.g. `https://your-site.netlify.app`).

## 3. Set environment variables in Netlify

Site configuration → **Environment variables** → add all of these:

| Key | Value | Notes |
| --- | ----- | ----- |
| `VITE_SUPABASE_URL` | `https://yqlxtpurpfamhsxrkxpe.supabase.co` | public |
| `VITE_SUPABASE_ANON_KEY` | your anon key | public |
| `SUPABASE_URL` | same as above | for functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role | **SECRET** — needed by the webhook + reminder cron |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (or `pk_test_` to soft-launch) | public |
| `STRIPE_SECRET_KEY` | `sk_live_...` | **SECRET** |
| `STRIPE_WEBHOOK_SECRET` | from step 4 | **SECRET** |
| `RESEND_API_KEY` | `re_...` | **SECRET** |
| `RESEND_FROM_EMAIL` | `PlainRights Court <noreply@yourdomain>` | needs a verified domain for arbitrary recipients |
| `ADMIN_EMAIL` | `ettrickc@gmail.com` | law-review alerts |
| `APP_URL` | your Netlify site URL | Stripe redirect base |

Redeploy after setting variables.

## 4. Create the Stripe webhook

1. Stripe dashboard → Developers → **Webhooks → Add endpoint**.
2. Endpoint URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
3. Events to send: **`checkout.session.completed`**, **`customer.subscription.updated`**,
   **`customer.subscription.deleted`** (the last two power subscription renewals/cancellations).
4. Copy the **Signing secret** (`whsec_...`) → set it as `STRIPE_WEBHOOK_SECRET` in Netlify → redeploy.
5. Stripe → Settings → Billing → **Customer portal** → activate it (enables "Manage/cancel subscription").

### Subscription columns migration

Run this once in the Supabase SQL editor (adds the columns the webhook writes):

```sql
alter table public.profiles
  add column if not exists subscription_plan text,
  add column if not exists subscription_status text,
  add column if not exists subscription_period_end timestamptz,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;
```

The `protect_is_admin` trigger in `supabase/schema.sql` also guards these columns —
re-run that trigger block so users can't self-grant a subscription.

## 5. Supabase auth redirect URLs

Supabase → Authentication → **URL Configuration** → add your Netlify URL to
Site URL and Redirect URLs (so email links / OAuth return correctly).

---

## GO-LIVE CHECKLIST (do not skip)

- [ ] **Re-enable "Confirm email"** in Supabase Auth (it was turned OFF for testing).
      Configure Resend (or Supabase SMTP) so confirmation emails actually send.
- [ ] **Run the admin-protection trigger** (in `supabase/schema.sql`, the
      `protect_is_admin` block) in the SQL editor — blocks users from self-granting admin.
- [ ] **Make your real account admin:**
      `update public.profiles set is_admin = true where email = 'ettrickc@gmail.com';`
- [ ] **Verify every statute** in the Admin → Law Review dashboard. They ship
      UNVERIFIED — citations and court-form numbers must be confirmed against current
      NY law before customers rely on documents. This is the most important step.
- [ ] Switch Stripe to **live keys** (`pk_live`/`sk_live` + a live-mode webhook secret).
- [ ] Delete test users (`ettrickc+prtest1/2/3`) and test documents.
- [ ] Verify a real (small) live purchase end-to-end, then refund it.
- [ ] Confirm the scheduled functions appear under Netlify → Functions and run
      automatically: `notice-reminders` (daily), `abandoned-docs` (daily — recovers
      unfinished documents), `admin-annual-review` (Jan 1). All need
      `SUPABASE_SERVICE_ROLE_KEY` + `RESEND_API_KEY` in env.
- [ ] Review pricing in `src/lib/pricing.js`.

## Known gaps / future work
- **Subscriptions** (monthly/annual) are not built — only per-document checkout.
- Document library is a strong subset (notices, nonpayment petition, affidavit of
  service, tenant answer + OSC, termination + cure notices). The remaining trees in
  the spec are added document-by-document on the same framework, each with review.
- Google OAuth deferred (email/password only).
