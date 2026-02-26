/**
 * Configura las variables de entorno en Vercel (SOLO production)
 * sin trailing newlines usando stdin exacto.
 * Ejecutar: node set-prod-env.mjs
 */
import { execFileSync } from "child_process";

const vars = {
    NEXT_PUBLIC_SUPABASE_URL: "https://lpbnnhvqahcxxppzrhac.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm5uaHZxYWhjeHhwcHpyaGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDE3ODYsImV4cCI6MjA4NzQ3Nzc4Nn0.gc1bGlKG8dVa1eH7TW2B603GI0PUiQc3RpHWSS4nsMg",
    SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm5uaHZxYWhjeHhwcHpyaGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkwMTc4NiwiZXhwIjoyMDg3NDc3Nzg2fQ.VbS4JG8oa6Wk_OvO2qT1y17Z_DNRF3A9CR1-Ed6jHZs",
    STELLAR_NETWORK: "testnet",
    STELLAR_HORIZON_URL: "https://horizon-testnet.stellar.org",
    NEXT_PUBLIC_SITE_URL: "https://website-segunda.vercel.app",
};

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

for (const [key, rawValue] of Object.entries(vars)) {
    console.log(`Setting ${key}...`);
    // Valor como Buffer sin newline al final
    const input = Buffer.from(rawValue, "utf8");
    try {
        execFileSync(
            npx,
            ["vercel", "env", "add", key, "production", "--force"],
            { input, encoding: "buffer", timeout: 30000, stdio: ["pipe", "inherit", "inherit"] }
        );
        console.log(`  ✓ ${key} set`);
    } catch (e) {
        console.error(`  ✗ ${key}: exit ${e.status}`);
    }
}

console.log("\nAll production env vars set. Deploying...");
try {
    execFileSync(npx, ["vercel", "deploy", "--prod", "--yes"], {
        stdio: "inherit",
        timeout: 300000,
    });
} catch (e) {
    console.error("Deploy failed:", e.message);
    process.exit(1);
}
