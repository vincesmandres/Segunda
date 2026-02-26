import "server-only";

export type IssuerStatusResult = {
  allowed: boolean;
  status?: string;
  display_name?: string;
};

// BYPASS TEMPORAL: cualquier wallet puede emitir certificados.
// Cuando quieras restringir por whitelist, restaura la lógica con Supabase.

export async function isIssuerAllowed(_issuer_public: string): Promise<boolean> {
  return true;
}

export async function isIssuerByProfile(
  _issuer_public: string,
  _userId: string
): Promise<boolean> {
  return true;
}

export async function getIssuerStatus(_issuer_public: string): Promise<IssuerStatusResult> {
  return { allowed: true, status: "active", display_name: "Cualquier Usuario" };
}
