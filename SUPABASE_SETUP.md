# Supabase Setup Guide

This guide walks you through setting up the Supabase backend for the Photography Portfolio website.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account).
2. Click **"New Project"**.
3. Choose your organization.
4. Enter a project name (e.g., `lakshyajit-portfolio`).
5. Set a strong database password (save it securely — you won't need it in the frontend).
6. Select a region close to your users (e.g., `ap-south-1` for India).
7. Click **"Create new project"** and wait for provisioning to complete.

## 2. Find Your API Credentials

1. In the Supabase Dashboard, go to **Settings → API**.
2. You need two values:

| Value | Where to find it | Description |
|-------|-------------------|-------------|
| **Project URL** | `Settings → API → Project URL` | Looks like `https://abcdefghijkl.supabase.co` |
| **anon (public) key** | `Settings → API → Project API keys → anon public` | A long JWT string starting with `eyJ...` |

> ⚠️ **IMPORTANT**: Never use the `service_role` key in frontend code. Only use the `anon` (public/publishable) key.

## 3. Run the Database Migration

1. In the Supabase Dashboard, go to **SQL Editor**.
2. Click **"New query"**.
3. Open the file `supabase/migration.sql` from this repository.
4. Copy the entire contents and paste it into the SQL Editor.
5. Click **"Run"**.
6. You should see a success message with no errors.

This creates:
- `newsletter_subscribers` table with email uniqueness constraint
- `inquiries` table for contact form submissions
- Row Level Security (RLS) enabled on both tables
- INSERT-only policies for anonymous users
- Minimum required grants for the `anon` role

## 4. Verify the Database Setup

### Check Tables
1. Go to **Table Editor** in the Supabase Dashboard.
2. Verify both `newsletter_subscribers` and `inquiries` tables appear.
3. Click each table to confirm the columns match the schema.

### Check RLS
1. Go to **Authentication → Policies**.
2. Verify both tables show:
   - RLS: **Enabled**
   - One policy each: "Allow anonymous insert on [table_name]"
3. There should be **no** SELECT, UPDATE, or DELETE policies.

### Quick Security Test (Optional)
In the SQL Editor, run:
```sql
-- This should return rows (as superuser you bypass RLS)
SELECT * FROM newsletter_subscribers;
SELECT * FROM inquiries;
```

To test RLS from the frontend perspective, try using the Supabase client in the browser console:
```js
// This INSERT should succeed
const { error } = await supabase.from('newsletter_subscribers').insert({ email: 'test@example.com' });

// This SELECT should fail (empty result or error)
const { data, error: selectError } = await supabase.from('newsletter_subscribers').select('*');
```

## 5. Configure the Website

Open `js/supabase-config.js` and replace the placeholder values:

```js
const SUPABASE_URL = 'https://your-project-ref.supabase.co';  // ← Your Project URL
const SUPABASE_KEY = 'eyJhbGciOi...your-anon-key...';          // ← Your anon public key
```

Save the file. The forms should now be functional.

## 6. Test the Integration

### Newsletter Form (in any page footer)
1. Enter an email address and click **Sign Up**.
2. You should see "Thank you for subscribing!"
3. Check the `newsletter_subscribers` table in Supabase — the email should appear.
4. Submit the same email again — you should see "You're already subscribed!"

### Contact Form (index.html or contact.html)
1. Fill in all required fields and click **Submit Request** / **SUBMIT INQUIRY**.
2. You should see "Your inquiry has been submitted. Thank you!"
3. Check the `inquiries` table in Supabase — the record should appear.
4. If the "Sign up for news and updates" checkbox was checked, the email should also appear in `newsletter_subscribers`.

## 7. Vercel Deployment

For the Vercel production deployment:

Since this is a static site and the publishable key is safe in browser code, the credentials are committed directly in `js/supabase-config.js`. No Vercel environment variables are required for basic functionality.

If you later want to use environment variables (e.g., for a build step):

| Vercel Environment Variable | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key |

## Architecture Overview

```
Visitor Browser
      │
      ├─ Newsletter form submit ──→ Supabase JS Client ──→ newsletter_subscribers (INSERT only)
      │
      └─ Contact form submit ────→ Supabase JS Client ──→ inquiries (INSERT only)
                                                    └──→ newsletter_subscribers (if checkbox checked)

Security:
  ✅ RLS enabled on both tables
  ✅ Only INSERT allowed for anonymous users
  ✅ No SELECT/UPDATE/DELETE for anonymous users
  ✅ Only anon (publishable) key used in frontend
  ✅ No service_role key exposed
  ✅ No database password exposed
```
