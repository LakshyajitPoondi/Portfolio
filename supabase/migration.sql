-- =============================================================================
-- Supabase Migration: Newsletter Subscribers + Inquiries
-- =============================================================================
-- Run this SQL in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- ─── Table 1: newsletter_subscribers ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT only
CREATE POLICY "Allow anonymous insert on newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No SELECT / UPDATE / DELETE policies for anon — denied by default with RLS enabled

-- Grant the minimum required privilege to the anon role
GRANT INSERT ON public.newsletter_subscribers TO anon;


-- ─── Table 2: inquiries ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.inquiries (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT        NOT NULL,
  last_name  TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT only
CREATE POLICY "Allow anonymous insert on inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No SELECT / UPDATE / DELETE policies for anon — denied by default with RLS enabled

-- Grant the minimum required privilege to the anon role
GRANT INSERT ON public.inquiries TO anon;
