-- Permite vincular el perfil de certificaciones (subject_profile) al usuario para mostrar QR en MI PERFIL
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subject_profile_token text;

COMMENT ON COLUMN public.profiles.subject_profile_token IS 'Token del perfil público de certificaciones (/perfil-certificado/:token) para mostrar QR de verificación';
