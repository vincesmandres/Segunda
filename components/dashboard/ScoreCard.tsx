import { Card } from "@/components/ui";
import { type TrustScore } from "@/lib/mock-trust";
import { getLevelColor } from "@/lib/mock-trust";

interface ScoreCardProps {
  data: TrustScore;
}

export function ScoreCard({ data }: ScoreCardProps) {
  return (
    <Card className="text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
        Puntuación de confianza
      </p>
      <p className="mt-2 font-semibold tabular-nums text-[var(--primary)] text-4xl sm:text-5xl md:text-6xl">
        {data.score}
      </p>
      <p className={`mt-2 text-lg font-semibold ${getLevelColor(data.level)}`}>
        {data.level}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Actualizado recientemente
      </p>
    </Card>
  );
}
