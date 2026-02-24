# Segunda

Plataforma de **emisión y verificación de certificados digitales** para instituciones educativas y programas de desarrollo de talento, construida sobre la red **Stellar** como capa de confianza.

Permite emitir credenciales digitales listas para compartir y verificar en línea. Cada certificado se registra mediante una huella criptográfica (hash) en Stellar, lo que proporciona trazabilidad, integridad y verificación independiente, sin exponer datos sensibles en la cadena.

Orientado a bootcamps, academias y organizaciones de educación alternativa en LATAM.

---

## Tech Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Stellar** – anclado de hashes en la red (testnet/public)
- **Supabase** – auth, base de datos, Edge Functions
- **Storage local** – JSON (`data/records.json`) para MVP

---

## Rutas y funcionalidad

| Ruta | Descripción |
|------|-------------|
| `/` | Landing con título, botones Emitir/Verificar, How it works |
| `/issue` | Formulario de emisión (issuer, subject, program, date, internal_id) |
| `/verify` | Verificación por hash (prefill desde query `?hash=`) |
| `POST /api/v1/issue` | Canonicaliza, hashea, ancla en Stellar (opcional), guarda record |
| `POST /api/v1/verify` | Busca record por hash, devuelve valid/invalid + payload |

---

## Estructura del proyecto

```
├── app/
│   ├── page.tsx              # Landing
│   ├── issue/page.tsx        # Emitir certificado
│   ├── verify/page.tsx       # Verificar por hash
│   └── api/v1/
│       ├── issue/route.ts    # POST emitir
│       └── verify/route.ts   # POST verificar
├── components/ui/            # Button, Input, Label, Card
├── lib/
│   ├── canonicalize.ts       # Normalización de payload
│   ├── hash.ts               # SHA-256 (servidor)
│   ├── storage.ts            # CRUD en records.json
│   ├── stellar.ts            # Anclado en Stellar
│   ├── stellar-config.ts     # Config + modo mock
│   └── supabase-server.ts    # Cliente Supabase (servidor)
├── data/records.json         # Storage local de certificados
├── supabase/
│   ├── migrations/           # Esquema (profiles, credentials)
│   └── functions/verify-wallet/   # Edge Function
└── docs/supabase_setup.md    # Setup Supabase
```

---

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

Crea `.env.local` en la raíz:

```env
# Stellar (modo mock si STELLAR_ISSUER_SECRET está vacío)
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_ISSUER_SECRET=
STELLAR_ISSUER_PUBLIC=

# Supabase (para route handlers / persistencia futura)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

**Importante:** No expongas claves secretas (Service Role, Stellar secret) al cliente.

---

## Supabase

El proyecto incluye:

- **Migración** `init_web3_schema`: tablas `profiles` y `credentials` con RLS
- **Edge Function** `verify-wallet`: validación de wallet (wallet, message, signature)

Comandos y checklist en [`docs/supabase_setup.md`](docs/supabase_setup.md).

---

## Estado actual

| Componente | Estado |
|------------|--------|
| Landing, Issue, Verify | ✅ Funcional |
| API issue/verify | ✅ Funcional |
| Storage (records.json) | ✅ Funcional (local) |
| Stellar anchoring | ✅ Funcional si `STELLAR_ISSUER_SECRET` está configurado |
| Supabase (tablas, Edge Function) | ✅ Configurado, no integrado aún al flujo principal |

---

## Despliegue (Vercel)

1. Conecta el repo en [vercel.com/new](https://vercel.com/new).
2. Añade las variables de entorno en **Settings → Environment Variables**.
3. Deploy.

**Nota:** El storage en `data/records.json` es efímero en serverless. Para producción, integrar persistencia en Supabase u otro backend.

---

## Roadmap

- Integrar storage con Supabase (`credentials`) en lugar de JSON local
- Verificación criptográfica en la Edge Function `verify-wallet`
- Auth de instituciones (Supabase Auth)
- Cohorts y emisión masiva
