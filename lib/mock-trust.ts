/**
 * Mock Trust Engine — datos y tipos para el MVP.
 * Listo para sustituir por API de reputación o integración con wallets/instituciones.
 */

export type TrustLevel = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface TrustScore {
  score: number;
  level: TrustLevel;
  consistency: number;
  stability: number;
  riskSignal: "low" | "medium" | "high";
  updatedAt: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  label: string;
  value: number;
  trend: "up" | "down" | "stable";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  consentAnalytics: boolean;
  consentSharing: boolean;
  consentMarketing: boolean;
}

export const MOCK_TRUST_SCORE: TrustScore = {
  score: 742,
  level: "Silver",
  consistency: 87,
  stability: 92,
  riskSignal: "low",
  updatedAt: new Date().toISOString(),
};

export const MOCK_TIMELINE: TimelineEntry[] = [
  { id: "1", date: "2025-02", label: "Score", value: 742, trend: "up" },
  { id: "2", date: "2025-01", label: "Score", value: 718, trend: "up" },
  { id: "3", date: "2024-12", label: "Score", value: 695, trend: "stable" },
  { id: "4", date: "2024-11", label: "Score", value: 682, trend: "up" },
  { id: "5", date: "2024-10", label: "Score", value: 661, trend: "up" },
];

export const MOCK_USER: UserProfile = {
  id: "usr_1",
  name: "Alex Rivera",
  email: "alex@example.com",
  consentAnalytics: true,
  consentSharing: true,
  consentMarketing: false,
};

export function getLevelColor(level: TrustLevel): string {
  switch (level) {
    case "Platinum":
      return "text-[var(--primary)]";
    case "Gold":
      return "text-[var(--foreground)]";
    case "Silver":
      return "text-[var(--muted)]";
    case "Bronze":
      return "text-[var(--muted)]";
    default:
      return "text-[var(--muted)]";
  }
}
