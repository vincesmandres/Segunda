import { Activity, Shield, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui";
import type { TrustScore } from "@/lib/mock-trust";

interface IndicatorsProps {
  data: TrustScore;
}

const riskLabels = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

export function Indicators({ data }: IndicatorsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="flex flex-row items-center gap-4 sm:flex-col sm:items-start">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--primary)]">
          <Activity className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            Consistencia
          </p>
          <p className="text-xl font-semibold text-[var(--foreground)]">
            {data.consistency}%
          </p>
        </div>
      </Card>
      <Card className="flex flex-row items-center gap-4 sm:flex-col sm:items-start">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--primary)]">
          <Shield className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            Estabilidad
          </p>
          <p className="text-xl font-semibold text-[var(--foreground)]">
            {data.stability}%
          </p>
        </div>
      </Card>
      <Card className="flex flex-row items-center gap-4 sm:flex-col sm:items-start">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--warning)]">
          <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-[var(--muted)]">
            Señal de riesgo
          </p>
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {riskLabels[data.riskSignal]}
          </p>
        </div>
      </Card>
    </div>
  );
}
