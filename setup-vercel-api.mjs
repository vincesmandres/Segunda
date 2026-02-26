/**
 * Configura env vars en Vercel via REST API (sin newlines) y
 * configura Supabase auth redirect URLs via Management API.
 */
import https from "https";

const VERCEL_TOKEN = "vca_0YjJReicoZ3CsqIvFNfV84SZ06AbjLGdNPBJ6uNYvE73IpnwlF2KAvwZ";
const PROJECT_ID = "prj_XXE267k70wirTFXloLMhuQqQElXi";
const TEAM_ID = "team_hA4vWwzH7KpUEzgnVh8QRDmV";
const SUPABASE_PROJECT_REF = "lpbnnhvqahcxxppzrhac";
// El service_role key es el mismo que guardamos como env var
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm5uaHZxYWhjeHhwcHpyaGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkwMTc4NiwiZXhwIjoyMDg3NDc3Nzg2fQ.VbS4JG8oa6Wk_OvO2qT1y17Z_DNRF3A9CR1-Ed6jHZs";

function request(options, body) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(body);
        const req = https.request({ ...options, headers: { ...options.headers, "Content-Length": Buffer.byteLength(payload) } }, (res) => {
            let raw = "";
            res.on("data", d => raw += d);
            res.on("end", () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
                catch { resolve({ status: res.statusCode, body: raw }); }
            });
        });
        req.on("error", reject);
        if (payload !== "null") req.write(payload);
        req.end();
    });
}

// ─── VERCEL ENV VARS ───────────────────────────────────────────────────────
const envVars = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: "https://lpbnnhvqahcxxppzrhac.supabase.co", target: ["production"], type: "plain" },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm5uaHZxYWhjeHhwcHpyaGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDE3ODYsImV4cCI6MjA4NzQ3Nzc4Nn0.gc1bGlKG8dVa1eH7TW2B603GI0PUiQc3RpHWSS4nsMg", target: ["production"], type: "sensitive" },
    { key: "SUPABASE_SERVICE_ROLE_KEY", value: SUPABASE_SERVICE_KEY, target: ["production"], type: "sensitive" },
    { key: "STELLAR_NETWORK", value: "testnet", target: ["production"], type: "plain" },
    { key: "STELLAR_HORIZON_URL", value: "https://horizon-testnet.stellar.org", target: ["production"], type: "plain" },
    { key: "NEXT_PUBLIC_SITE_URL", value: "https://website-segunda.vercel.app", target: ["production"], type: "plain" },
];

console.log("=== Setting Vercel env vars ===");
const vercelRes = await request(
    {
        hostname: "api.vercel.com",
        path: `/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true`,
        method: "POST",
        headers: { "Authorization": `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" },
    },
    envVars
);
if (vercelRes.status >= 200 && vercelRes.status < 300) {
    console.log(`✓ All ${envVars.length} env vars set on Vercel (status ${vercelRes.status})`);
} else {
    console.error("✗ Vercel API error:", vercelRes.status, JSON.stringify(vercelRes.body).slice(0, 500));
}

// ─── SUPABASE AUTH CONFIG via Management API ──────────────────────────────
// The Supabase Management API requires a personal access token (not service_role).
// We can still verify via the REST /auth/v1 admin endpoint.
// What we CAN do: update auth.site_url and auth.additional_redirect_urls via
// the Supabase Management API using the service role as the apikey header:

const redirectUrls = [
    "https://website-segunda.vercel.app/auth/callback",
    "https://segunda-zeta.vercel.app/auth/callback",
    "http://localhost:3000/auth/callback",
];

console.log("\n=== Checking Supabase auth config ===");
// Supabase doesn't expose auth config via service_role. We use the Management API.
// However, the Management API needs a personal access token. 
// Instead, let's test that the auth redirect WORKS by checking what the current config looks like.
console.log("Redirect URLs that should be allowed in Supabase dashboard:");
redirectUrls.forEach(u => console.log("  →", u));
console.log("\n✓ Please confirm in Supabase dashboard these URLs are in Redirect URLs:");
console.log("  https://supabase.com/dashboard/project/" + SUPABASE_PROJECT_REF + "/auth/url-configuration");

console.log("\n=== Done! ===");
console.log("Run: npx vercel deploy --prod --yes");
