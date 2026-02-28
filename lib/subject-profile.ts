import { randomBytes } from "crypto";
import { getSupabaseAdmin } from "./supabase-server";

const TOKEN_LENGTH = 14;
const TOKEN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateToken(): string {
  const bytes = randomBytes(TOKEN_LENGTH);
  let s = "";
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    s += TOKEN_CHARS[bytes[i]! % TOKEN_CHARS.length];
  }
  return s;
}

export type SubjectProfile = {
  id: string;
  token: string;
  subject_name: string;
  internal_id: string;
  created_at: string;
  updated_at: string;
};

export type SubjectCertificateLink = {
  hash: string;
  created_at: string;
};

/**
 * Obtiene o crea un perfil de persona certificada (por nombre + internal_id).
 * Al crear uno nuevo se genera un token único para la URL de perfil.
 */
export async function getOrCreateSubjectProfile(
  subject_name: string,
  internal_id: string
): Promise<SubjectProfile> {
  const supabase = getSupabaseAdmin();
  const name = subject_name.trim();
  const id = (internal_id ?? "").trim();

  const { data: existing } = await supabase
    .from("subject_profiles")
    .select("id, token, subject_name, internal_id, created_at, updated_at")
    .eq("subject_name", name)
    .eq("internal_id", id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return {
      id: existing.id,
      token: existing.token,
      subject_name: existing.subject_name,
      internal_id: existing.internal_id ?? "",
      created_at: existing.created_at,
      updated_at: existing.updated_at ?? existing.created_at,
    };
  }

  const token = generateToken();
  const { data: inserted, error } = await supabase
    .from("subject_profiles")
    .insert({
      token,
      subject_name: name,
      internal_id: id,
    })
    .select("id, token, subject_name, internal_id, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(`subject_profile_insert: ${error.message}`);
  }

  return {
    id: inserted.id,
    token: inserted.token,
    subject_name: inserted.subject_name,
    internal_id: inserted.internal_id ?? "",
    created_at: inserted.created_at,
    updated_at: inserted.updated_at ?? inserted.created_at,
  };
}

/**
 * Vincula un certificado (hash) a un perfil de persona.
 */
export async function linkCertificateToSubject(
  subject_id: string,
  hash: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("subject_certificates").upsert(
    { subject_id, hash },
    { onConflict: "subject_id,hash" }
  );
  if (error) {
    throw new Error(`subject_certificates_insert: ${error.message}`);
  }
}

/**
 * Devuelve el perfil y todas las certificaciones (hashes) de una persona por token.
 */
export async function getSubjectProfileByToken(token: string): Promise<{
  profile: SubjectProfile | null;
  certificates: SubjectCertificateLink[];
}> {
  const supabase = getSupabaseAdmin();
  const t = (token ?? "").trim();
  if (!t) {
    return { profile: null, certificates: [] };
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("subject_profiles")
    .select("id, token, subject_name, internal_id, created_at, updated_at")
    .eq("token", t)
    .limit(1)
    .maybeSingle();

  if (profileError || !profileRow) {
    return { profile: null, certificates: [] };
  }

  const { data: certs } = await supabase
    .from("subject_certificates")
    .select("hash, created_at")
    .eq("subject_id", profileRow.id)
    .order("created_at", { ascending: false });

  const profile: SubjectProfile = {
    id: profileRow.id,
    token: profileRow.token,
    subject_name: profileRow.subject_name,
    internal_id: profileRow.internal_id ?? "",
    created_at: profileRow.created_at,
    updated_at: profileRow.updated_at ?? profileRow.created_at,
  };

  const certificates: SubjectCertificateLink[] = (certs ?? []).map((c) => ({
    hash: c.hash,
    created_at: c.created_at,
  }));

  return { profile, certificates };
}
