import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui";
import type { TimelineEntry } from "@/lib/mock-trust";

interface TimelineProps {
  entries: TimelineEntry[];
}

function TrendIcon({ trend }: { trend: TimelineEntry["trend"] }) {
  if (trend === "up")
    return <TrendingUp className="h-4 w-4 text-[var(--success)]" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-[var(--danger)]" />;
  return <Minus className="h-4 w-4 text-[var(--muted)]" />;
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">
        Progreso
      </h3>
      <ul className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between border-b border-[var(--border)] py-3 last:border-0"
          >
            <span className="text-sm text-[var(--muted)]">{entry.date}</span>
            <span className="font-medium text-[var(--foreground)]">
              {entry.value}
            </span>
            <TrendIcon trend={entry.trend} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
