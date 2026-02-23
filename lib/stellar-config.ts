/**
 * Configuración Stellar. Modo "mock" cuando STELLAR_ISSUER_SECRET está vacío.
 */

export const stellarConfig = {
  network: process.env.STELLAR_NETWORK ?? "testnet",
  horizonUrl: process.env.STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org",
  issuerSecret: process.env.STELLAR_ISSUER_SECRET ?? "",
  issuerPublic: process.env.STELLAR_ISSUER_PUBLIC ?? "",
} as const;

export const isStellarMockMode = !stellarConfig.issuerSecret || stellarConfig.issuerSecret.trim() === "";
