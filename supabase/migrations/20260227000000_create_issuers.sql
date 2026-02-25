-- Tabla public.issuers: emisores autorizados para anclar certificados (idempotente)

CREATE TABLE IF NOT EXISTS public.issuers (
  issuer_public text PRIMARY KEY,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_issuers_status ON public.issuers(status);

-- Ejemplo: reemplaza 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' con tu issuer_public
-- INSERT INTO public.issuers (issuer_public, display_name, status)
-- VALUES ('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Mi Issuer', 'active');
