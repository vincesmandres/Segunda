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

-- 3. Tabla profiles (auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  wallet_public text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'issuer', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own profile" ON public.profiles;
CREATE POLICY "Users can select own profile"
  ON public.profiles FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- 4. Registrar tu issuer (reemplaza con tu issuer_public de Freighter)
-- INSERT INTO public.issuers (issuer_public, display_name, status)
-- VALUES ('TU_ISSUER_PUBLIC_AQUI', 'Mi Issuer', 'active');
