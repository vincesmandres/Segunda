# Script para configurar env vars en Vercel sin newlines
# Ejecutar desde el directorio del proyecto

$vars = @{
    "NEXT_PUBLIC_SUPABASE_URL"    = "https://lpbnnhvqahcxxppzrhac.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm5uaHZxYWhjeHhwcHpyaGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDE3ODYsImV4cCI6MjA4NzQ3Nzc4Nn0.gc1bGlKG8dVa1eH7TW2B603GI0PUiQc3RpHWSS4nsMg"
    "SUPABASE_SERVICE_ROLE_KEY"   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm5uaHZxYWhjeHhwcHpyaGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkwMTc4NiwiZXhwIjoyMDg3NDc3Nzg2fQ.VbS4JG8oa6Wk_OvO2qT1y17Z_DNRF3A9CR1-Ed6jHZs"
    "STELLAR_NETWORK"             = "testnet"
    "STELLAR_HORIZON_URL"         = "https://horizon-testnet.stellar.org"
    "NEXT_PUBLIC_SITE_URL"        = "https://website-segunda.vercel.app"
}

foreach ($key in $vars.Keys) {
    $val = $vars[$key]
    Write-Host "Adding $key ..."
    # Pasamos el valor via stdin sin newline usando [System.IO.Stream]
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($val)
    $ms = New-Object System.IO.MemoryStream
    $ms.Write($bytes, 0, $bytes.Length)
    $ms.Seek(0, [System.IO.SeekOrigin]::Begin) | Out-Null
    $oldIn = [Console]::In
    $reader = New-Object System.IO.StreamReader($ms)
    [Console]::SetIn($reader)
    & npx vercel env add $key production --force 2>&1
    [Console]::SetIn($oldIn)
    $reader.Close()
    $ms.Close()
}

Write-Host "`nAll env vars set! Run 'npx vercel deploy --prod --yes' to redeploy."
