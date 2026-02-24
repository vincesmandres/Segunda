-- Add issuer_public column and index. Safe for existing records (column is nullable).

ALTER TABLE public.credentials
  ADD COLUMN IF NOT EXISTS issuer_public text;

CREATE INDEX IF NOT EXISTS idx_credentials_issuer_public
  ON public.credentials(issuer_public);
