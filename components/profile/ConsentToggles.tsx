"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import type { UserProfile } from "@/lib/mock-trust";

interface ConsentTogglesProps {
  user: UserProfile;
}

export function ConsentToggles({ user: initial }: ConsentTogglesProps) {
  const [consents, setConsents] = useState({
    analytics: initial.consentAnalytics,
    sharing: initial.consentSharing,
    marketing: initial.consentMarketing,
  });

  const toggle = (key: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    {
      key: "analytics" as const,
      label: "Uso de datos para mejorar el score",
      description: "Permite analizar tu actividad para refinar el Trust Engine.",
    },
    {
      key: "sharing" as const,
      label: "Compartir score con terceros verificados",
      description: "Instituciones autorizadas pueden consultar tu reputación.",
    },
    {
      key: "marketing" as const,
      label: "Comunicaciones y novedades",
      description: "Recibir actualizaciones sobre Segunda y productos.",
    },
  ];

  return (
    <Card>
      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Consentimientos
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Gestiona cómo usamos y compartimos tu información.
      </p>
      <ul className="mt-6 space-y-4">
        {items.map(({ key, label, description }) => (
          <li
            key={key}
            className="flex flex-col gap-2 border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-[var(--foreground)]">
                {label}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={consents[key]}
                onClick={() => toggle(key)}
                className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:ring-offset-2 ${
                  consents[key]
                    ? "border-[var(--primary)] bg-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--background)]"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    consents[key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-[var(--muted)]">{description}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
