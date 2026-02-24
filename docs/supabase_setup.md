# Supabase Setup - Segunda

## Comandos ejecutados (en orden)

```powershell
# 1. Inicializar Supabase en el repo
npx supabase init

# 2. Vincular al proyecto cloud (PROJECT_REF = lpbnnhvqahcxxppzrhac desde la URL)
npx supabase link --project-ref lpbnnhvqahcxxppzrhac

# 3. Crear migración (ya creada manualmente)
npx supabase migration new init_web3_schema

# 4. Aplicar migraciones al cloud
npx supabase db push

# 5. Desplegar Edge Function
npx supabase functions deploy verify-wallet
```

## Checklist de verificación en Supabase Dashboard

- [ ] **Tables**: En *Table Editor* aparecen `public.profiles` y `public.credentials`
- [ ] **RLS**: Ambas tablas tienen Row Level Security habilitado
- [ ] **Policies**: `profiles_select_own` y `credentials_select_own` aplicadas
- [ ] **Edge Functions**: `verify-wallet` aparece en *Edge Functions* y está deployed

## Probar la Edge Function desde PowerShell

Usa tu **anon key** o **publishable key** desde: *Settings → API → Project API keys*.

### Test POST exitoso (campos completos)

```powershell
$body = @{
  wallet   = "0x1234567890abcdef"
  message  = "Sign this message"
  signature = "0xabcdef123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://lpbnnhvqahcxxppzrhac.supabase.co/functions/v1/verify-wallet" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer TU_ANON_KEY_O_PUBLISHABLE_KEY"
    "Content-Type"  = "application/json"
  } `
  -Body $body
```

Respuesta esperada: `{ ok: true }`

### Test POST con campos faltantes (400)

```powershell
$body = '{"wallet":"0x123"}'
Invoke-RestMethod -Uri "https://lpbnnhvqahcxxppzrhac.supabase.co/functions/v1/verify-wallet" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer TU_ANON_KEY_O_PUBLISHABLE_KEY"
    "Content-Type"  = "application/json"
  } `
  -Body $body
```

Respuesta esperada: JSON con `error` y `missing`.

### Alternativa con curl (si está disponible)

```powershell
curl.exe -X POST "https://lpbnnhvqahcxxppzrhac.supabase.co/functions/v1/verify-wallet" `
  -H "Authorization: Bearer TU_ANON_KEY_O_PUBLISHABLE_KEY" `
  -H "Content-Type: application/json" `
  -d '{\"wallet\":\"0x123\",\"message\":\"hello\",\"signature\":\"0xabc\"}'
```

## Estructura creada

```
supabase/
├── config.toml
├── migrations/
│   └── 20260224052759_init_web3_schema.sql
└── functions/
    └── verify-wallet/
        └── index.ts
```
