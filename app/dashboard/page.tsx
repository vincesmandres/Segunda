import Link from "next/link";
import {
  ScoreCard,
  Indicators,
  Timeline,
  ShareTrustPassport,
} from "@/components/dashboard";
import { MOCK_TRUST_SCORE, MOCK_TIMELINE } from "@/lib/mock-trust";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-[var(--foreground)] hover:text-[var(--primary)]"
          >
            Segunda
          </Link>
          <Link
            href="/profile"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Perfil
          </Link>
        </div>
      </header>
      <main className="px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-4xl space-y-8">
          <ScoreCard data={MOCK_TRUST_SCORE} />
          <Indicators data={MOCK_TRUST_SCORE} />
          <Timeline entries={MOCK_TIMELINE} />
          <div className="flex justify-center pt-2">
            <ShareTrustPassport />
          </div>
        </div>
      </main>
    </div>
  );
}
