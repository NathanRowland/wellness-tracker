/*
  # Create wellness entries table

  1. New Tables
    - `wellness_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `timestamp` (timestamptz)
      - `metrics` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `wellness_entries` table
    - Add policies for authenticated users to:
      - Read their own entries
      - Create new entries
*/

CREATE TABLE IF NOT EXISTS wellness_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz NOT NULL,
  metrics jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own entries"
  ON wellness_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own entries"
  ON wellness_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);