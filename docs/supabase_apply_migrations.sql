-- Ejecutar en Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- Aplica migraciones: issuer_public en credentials + tabla issuers

-- 1. issuer_public en credentials
ALTER TABLE public.credentials
  ADD COLUMN IF NOT EXISTS issuer_public text;

CREATE INDEX IF NOT EXISTS idx_credentials_issuer_public
  ON public.credentials(issuer_public);

-- 2. Tabla issuers
CREATE TABLE IF NOT EXISTS public.issuers (
  issuer_public text PRIMARY KEY,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_issuers_status ON public.issuers(status);

-- 3. Registrar tu issuer (reemplaza con tu issuer_public de Freighter)
-- INSERT INTO public.issuers (issuer_public, display_name, status)
-- VALUES ('TU_ISSUER_PUBLIC_AQUI', 'Mi Issuer', 'active');
