import "server-only";

export type IssuerStatusResult = {
  allowed: boolean;
  status?: string;
  display_name?: string;
};

<<<<<<< HEAD
// BYPASS TEMPORAL: cualquier wallet puede emitir certificados.
// Cuando quieras restringir por whitelist, restaura la lógica con Supabase.

export async function isIssuerAllowed(_issuer_public: string): Promise<boolean> {
  return true;
}

=======
/**
 * Verifica si el usuario logueado tiene esa wallet vinculada en su perfil.
 * Permite emisión sin estar en la whitelist de issuers (role puede ser 'issuer' o 'user' con wallet vinculada).
 */
>>>>>>> origin/feature/certificate-record-qr-bulk
export async function isIssuerByProfile(
  _issuer_public: string,
  _userId: string
): Promise<boolean> {
<<<<<<< HEAD
  return true;
=======
  try {
    const supabase = getSupabaseAdmin();
    const trimmed = issuer_public.trim();
    // Cualquier perfil con esta wallet vinculada para este usuario puede emitir (role issuer o user)
    const { data, error } = await supabase
      .from("profiles")
      .select("role, wallet_public")
      .eq("id", userId)
      .eq("wallet_public", trimmed)
      .limit(1)
      .maybeSingle();

    const matched = !!(data && !error);
    // #region agent log
    console.log("[DEBUG isIssuerByProfile]", { matched, hasError: !!error });
    // #endregion
    if (error || !data) return false;
    return true;
  } catch (e) {
    console.error("[issuers] isIssuerByProfile:", e);
    return false;
  }
>>>>>>> origin/feature/certificate-record-qr-bulk
}

export async function getIssuerStatus(_issuer_public: string): Promise<IssuerStatusResult> {
  return { allowed: true, status: "active", display_name: "Cualquier Usuario" };
}
