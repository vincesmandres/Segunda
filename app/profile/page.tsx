import Link from "next/link";
import {
  ProfileGate,
  ProfileInfo,
  ConsentToggles,
  ExportReputation,
} from "@/components/profile";
import { MOCK_USER } from "@/lib/mock-trust";

export default function ProfilePage() {
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
            href="/dashboard"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Dashboard
          </Link>
        </div>
      </header>
      <main className="px-4 py-10 sm:px-6 md:py-14">
        <ProfileGate>
          <div className="mx-auto max-w-2xl space-y-8">
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Perfil
            </h1>
            <ProfileInfo user={MOCK_USER} />
            <ConsentToggles user={MOCK_USER} />
            <div className="flex justify-center pt-4">
              <ExportReputation />
            </div>
          </div>
        </ProfileGate>
      </main>
    </div>
  );
}
