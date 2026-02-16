import { Card } from "@/components/ui";
import type { UserProfile } from "@/lib/mock-trust";

interface ProfileInfoProps {
  user: UserProfile;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        Información básica
      </h2>
      <dl className="mt-4 space-y-3">
        <div>
          <dt className="text-xs font-medium uppercase text-[var(--muted)]">
            Nombre
          </dt>
          <dd className="mt-0.5 text-[var(--foreground)]">{user.name}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-[var(--muted)]">
            Email
          </dt>
          <dd className="mt-0.5 text-[var(--foreground)]">{user.email}</dd>
        </div>
      </dl>
    </Card>
  );
}
