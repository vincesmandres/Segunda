/**
 * Script para configurar Vercel env vars y Supabase auth settings correctamente.
 * Ejecutar: node setup-env.mjs
 */
import { execSync } from "child_process";
import https from "https";

// Leer el token de Vercel desde el CLI local
function getVercelToken() {
    // El token se guarda en la config local del CLI
    try {
        const r = execSync("npx vercel whoami --token='' 2>&1", { encoding: "utf8" });
        return null;
    } catch { }
    return null;
}

const PROJECT_ID = "prj_XXE267k70wirTFXloLMhuQqQElXi";
const TEAM_ID = "team_hA4vWwzH7KpUEzgnVh8QRDmV";

const envVars = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: "https://lpbnnhvqahcxxppzrhac.supabase.co", target: ["production", "preview", "development"], type: "plain" },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm5uaHZxYWhjeHhwcHpyaGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDE3ODYsImV4cCI6MjA4NzQ3Nzc4Nn0.gc1bGlKG8dVa1eH7TW2B603GI0PUiQc3RpHWSS4nsMg", target: ["production", "preview", "development"], type: "sensitive" },
    { key: "SUPABASE_SERVICE_ROLE_KEY", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm5uaHZxYWhjeHhwcHpyaGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkwMTc4NiwiZXhwIjoyMDg3NDc3Nzg2fQ.VbS4JG8oa6Wk_OvO2qT1y17Z_DNRF3A9CR1-Ed6jHZs", target: ["production", "preview"], type: "sensitive" },
    { key: "STELLAR_NETWORK", value: "testnet", target: ["production", "preview", "development"], type: "plain" },
    { key: "STELLAR_HORIZON_URL", value: "https://horizon-testnet.stellar.org", target: ["production", "preview", "development"], type: "plain" },
    { key: "NEXT_PUBLIC_SITE_URL", value: "https://website-segunda.vercel.app", target: ["production"], type: "plain" },
];

async function apiRequest(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const options = {
            hostname: "api.vercel.com",
            path,
            method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data),
            },
        };
        const req = https.request(options, (res) => {
            let raw = "";
            res.on("data", (chunk) => raw += chunk);
            res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(raw || "{}") }));
        });
        req.on("error", reject);
        req.write(data);
        req.end();
    });
}

// Obtener token desde los archivos de configuracion de Vercel CLI
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import os from "os";

function findVercelToken() {
    const paths = [
        join(os.homedir(), ".local/share/com.vercel.cli/auth.json"),
        join(os.homedir(), "AppData/Roaming/com.vercel.cli/auth.json"),
        join(os.homedir(), ".config/vercel/auth.json"),
        "/home/user/.local/share/com.vercel.cli/auth.json",
    ];
    for (const p of paths) {
        if (existsSync(p)) {
            try {
                const j = JSON.parse(readFileSync(p, "utf8"));
                return j.token;
            } catch { }
        }
    }
    // Intentar leer del archivo de credenciales del CLI en el directorio raiz
    try {
        const r = execSync("npx vercel whoami 2>&1", { encoding: "utf8", timeout: 10000 });
        console.log("CLI connected as:", r.trim());
    } catch { }
    return null;
}

const TOKEN = findVercelToken();
if (!TOKEN) {
    console.error("No se pudo encontrar el token de Vercel. Ejecuta 'npx vercel login' primero.");
    console.log("Intentando con el CLI directamente...");

    // Fallback: usar vercel CLI para cada variable
    for (const { key, value, target } of envVars) {
        for (const env of target) {
            try {
                const proc = execSync(
                    `npx vercel env add ${key} ${env} --force`,
                    {
                        input: value,
                        encoding: "utf8",
                        timeout: 30000,
                    }
                );
                console.log(`✓ ${key} (${env}) set`);
            } catch (e) {
                console.error(`✗ ${key} (${env}):`, e.message.slice(0, 100));
            }
        }
    }
    process.exit(0);
}

// Usar REST API
for (const envVar of envVars) {
    console.log(`Setting ${envVar.key}...`);
    const result = await apiRequest(
        "POST",
        `/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true`,
        [{ key: envVar.key, value: envVar.value, target: envVar.target, type: envVar.type }],
        TOKEN
    );
    if (result.status === 200 || result.status === 201) {
        console.log(`  ✓ ${envVar.key} set`);
    } else {
        console.error(`  ✗ ${envVar.key}: ${result.status}`, JSON.stringify(result.body).slice(0, 200));
    }
}

console.log("\nDone! Redeploy the project to apply the new env vars.");
