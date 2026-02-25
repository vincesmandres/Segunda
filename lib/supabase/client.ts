/**
 * Cliente Supabase para componentes client (browser).
 * Usa NEXT_PUBLIC_SUPABASE_ANON_KEY — NUNCA usar service_role en el cliente.
 */
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // #region agent log
    fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8afd1e'},body:JSON.stringify({sessionId:'8afd1e',runId:'pre-fix',hypothesisId:'H1',location:'lib/supabase/client.ts:13',message:'Missing env for browser supabase client',data:{hasUrl:!!supabaseUrl,hasAnonKey:!!supabaseAnonKey},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno."
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
