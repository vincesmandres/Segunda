-- Align credentials table to MVP schema (hash as PK, payload, anchored, tx_id, stellar_url)

DROP TABLE IF EXISTS public.credentials CASCADE;

CREATE TABLE public.credentials (
  hash text PRIMARY KEY,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  anchored boolean DEFAULT false,
  tx_id text,
  stellar_url text
);

ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
