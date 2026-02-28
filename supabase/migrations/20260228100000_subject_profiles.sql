-- Perfil de la persona certificada: un token por persona para ver todas sus certificaciones.
-- Útil para "mis certificaciones" y QR de verificación del perfil (futura app móvil).

CREATE TABLE IF NOT EXISTS public.subject_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  subject_name text NOT NULL,
  internal_id text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subject_profiles_token ON public.subject_profiles(token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subject_profiles_identity
  ON public.subject_profiles(subject_name, internal_id);

CREATE TABLE IF NOT EXISTS public.subject_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.subject_profiles(id) ON DELETE CASCADE,
  hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(subject_id, hash)
);

CREATE INDEX IF NOT EXISTS idx_subject_certificates_subject ON public.subject_certificates(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_certificates_hash ON public.subject_certificates(hash);

ALTER TABLE public.subject_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_certificates ENABLE ROW LEVEL SECURITY;

-- Lectura pública por token (cualquiera con el token puede ver el perfil de certificaciones)
CREATE POLICY "subject_profiles_read_by_token" ON public.subject_profiles
  FOR SELECT USING (true);

CREATE POLICY "subject_certificates_read" ON public.subject_certificates
  FOR SELECT USING (true);

-- Inserción/actualización solo desde el backend (service_role; bypass RLS).
-- No se crean políticas FOR INSERT/UPDATE para anon/auth.
