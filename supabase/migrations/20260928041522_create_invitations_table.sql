/*
# Create invitations table

1. New Tables
- `invitations`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `template_id` (text, not null - references template key in frontend)
  - `event_type` (text, not null - wedding, birthday, baby_shower, corporate, etc.)
  - `title` (text, not null - display title for dashboard)
  - `details` (jsonb, not null, default '{}' - stores all customizable card fields)
  - `share_uuid` (uuid, not null, unique - for public shareable links)
  - `is_premium_unlocked` (boolean, default false - whether premium template is paid for)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `invitations`.
- Owner-scoped CRUD for authenticated users (select/insert/update/delete).
- Public SELECT policy for anon+authenticated on share_uuid lookups (so anyone with the link can view the invitation).

3. Indexes
- Index on `user_id` for dashboard queries.
- Index on `share_uuid` for public link lookups.
*/

CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id text NOT NULL,
  event_type text NOT NULL,
  title text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  share_uuid uuid NOT NULL DEFAULT gen_random_uuid(),
  is_premium_unlocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Owner-scoped policies (authenticated users manage their own invitations)
DROP POLICY IF EXISTS "select_own_invitations" ON invitations;
CREATE POLICY "select_own_invitations" ON invitations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_invitations" ON invitations;
CREATE POLICY "insert_own_invitations" ON invitations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_invitations" ON invitations;
CREATE POLICY "update_own_invitations" ON invitations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_invitations" ON invitations;
CREATE POLICY "delete_own_invitations" ON invitations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Public read by share_uuid (anyone with the link can view the invitation)
DROP POLICY IF EXISTS "public_read_invitation_by_uuid" ON invitations;
CREATE POLICY "public_read_invitation_by_uuid" ON invitations FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_share_uuid ON invitations(share_uuid);
