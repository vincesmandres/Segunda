"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { requestAccess, getAddress } from "@stellar/freighter-api";
import { createClient } from "@/lib/supabase/client";
import { Button, Label, Card } from "@/components/ui";
import { WalletOnboardingModal } from "@/components/WalletOnboardingModal";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  wallet_public: string | null;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showOnboarding = searchParams.get("onboarding") === "true";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletTemp, setWalletTemp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);
  const [storedSecret, setStoredSecret] = useState<string | null>(null);
  const autoLinkAttempted = useRef(false);

  const fetchProfile = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const syncRes = await fetch("/api/profile/sync", { method: "POST", credentials: "include" });
    if (syncRes.status === 401) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, wallet_public")
      .eq("id", user.id)
      .single();

    if (!data) {
      setProfile({
        id: user.id,
        email: user.email ?? null,
        full_name:
          (user.user_metadata as Record<string, string>)?.full_name ??
          (user.user_metadata as Record<string, string>)?.name ?? null,
        avatar_url:
          (user.user_metadata as Record<string, string>)?.avatar_url ??
          (user.user_metadata as Record<string, string>)?.picture ?? null,
        wallet_public: null,
      });
      return;
    }

    if (error) console.error("[profile/page] load profile error", (error as { message: string }).message);
    setProfile(data);

    // Cargar secreto guardado si existe
    try {
      const raw = localStorage.getItem(`segunda_wallet_secret_${user.id}`);
      if (raw) setStoredSecret(atob(raw));
    } catch { /* ignora */ }
  }, [router]);

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, [fetchProfile]);

  // Si llega con ?onboarding=true, abrir el modal
  useEffect(() => {
    if (!loading && showOnboarding) {
      setOnboardingOpen(true);
    }
  }, [loading, showOnboarding]);

  // Auto-link Freighter si está conectado y no hay wallet vinculada
  useEffect(() => {
    if (!profile || profile.wallet_public || autoLinkAttempted.current || onboardingOpen) return;
    const tryAutoLink = async () => {
      autoLinkAttempted.current = true;
      const addr = await getAddress();
      const address = addr?.address?.trim();
      if (!address) return;
      setWalletLoading(true);
      const res = await fetch("/api/profile/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ wallet_public: address }),
      });
      if (res.ok) await fetchProfile();
      setWalletLoading(false);
    };
    tryAutoLink();
  }, [profile, fetchProfile, onboardingOpen]);

  const handleOnboardingComplete = useCallback(async (walletPublic: string) => {
    setOnboardingOpen(false);
    // Limpiar param de la URL sin recargar
    window.history.replaceState({}, "", "/profile");
    await fetchProfile();
    // Recargar secreto por si fue guardado
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const raw = localStorage.getItem(`segunda_wallet_secret_${user.id}`);
        if (raw) setStoredSecret(atob(raw));
      } catch { /* ignora */ }
    }
    void walletPublic;
  }, [fetchProfile]);

  const handleConnectFreighter = async () => {
    setWalletLoading(true);
    setError(null);
    try {
      const addr = await getAddress();
      if (addr?.address) {
        setWalletTemp(addr.address);
      } else {
        const access = await requestAccess();
        if (access?.address) setWalletTemp(access.address);
        else setError("No se pudo obtener la dirección");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al conectar Freighter");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleLinkWallet = async () => {
    if (!walletTemp.trim()) return;
    setError(null);
    const res = await fetch("/api/profile/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ wallet_public: walletTemp }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data?.details ?? data?.error ?? "Error al vincular"); return; }
    setWalletTemp("");
    await fetchProfile();
  };

  const handleUnlinkWallet = async () => {
    setError(null);
    const res = await fetch("/api/profile/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ wallet_public: null }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data?.details ?? data?.error ?? "Error al desvincular"); return; }
    await fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--black)]/70">Cargando…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--black)]/70">Redirigiendo…</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal de onboarding */}
      {onboardingOpen && (
        <WalletOnboardingModal
          userId={profile.id}
          onComplete={handleOnboardingComplete}
        />
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <Card className="max-w-lg w-full space-y-6">
          <h1
            className="text-lg font-[var(--font-pixel)]"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            MI PERFIL
          </h1>

          {/* Avatar + nombre */}
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-none border-2 border-[var(--black)]"
              />
            ) : (
              <div className="w-16 h-16 border-2 border-[var(--black)] bg-[var(--beige)] flex items-center justify-center text-2xl">
                ?
              </div>
            )}
            <div>
              <p className="font-medium">{profile.full_name ?? "—"}</p>
              <p className="text-sm text-[var(--black)]/70">{profile.email ?? "—"}</p>
            </div>
          </div>

          {/* Wallet pública */}
          <div className="border-t-2 border-[var(--black)] pt-4 space-y-3">
            <h2
              className="text-sm font-[var(--font-pixel)]"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              WALLET STELLAR
            </h2>
            {profile.wallet_public ? (
              <>
                <div>
                  <Label>Dirección pública</Label>
                  <p className="font-mono text-xs break-all bg-[var(--beige)] p-3 border-2 border-[var(--black)] select-all">
                    {profile.wallet_public}
                  </p>
                </div>

                {/* Recovery key (solo si fue generada en este browser) */}
                {storedSecret !== null && (
                  <div>
                    <Label>Clave secreta (recovery)</Label>
                    {secretVisible ? (
                      <p className="font-mono text-xs break-all bg-red-50 border-2 border-red-400 p-3 select-all">
                        {storedSecret}
                      </p>
                    ) : (
                      <button
                        onClick={() => setSecretVisible(true)}
                        className="w-full text-sm bg-red-50 border-2 border-red-400 p-3 text-red-700 hover:bg-red-100 transition-colors"
                      >
                        Clic para revelar clave secreta
                      </button>
                    )}
                    <p className="text-xs text-[var(--black)]/60 mt-1">
                      ⚠️ Solo almacenada en este navegador. Guárdala en un lugar seguro.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button type="button" variant="secondary" onClick={handleUnlinkWallet}>
                    Desvincular wallet
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setOnboardingOpen(true)}>
                    Cambiar wallet
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-[var(--black)]/70">No tienes una wallet vinculada.</p>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setOnboardingOpen(true)}
                >
                  Configurar wallet
                </Button>
              </div>
            )}
          </div>

          {/* Conectar Freighter manualmente si ya hay wallet */}
          {!profile.wallet_public && (
            <div className="border-t-2 border-[var(--black)] pt-4 space-y-3">
              <h2
                className="text-sm font-[var(--font-pixel)]"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                CONECTAR FREIGHTER
              </h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleConnectFreighter}
                  disabled={walletLoading}
                >
                  {walletLoading ? "Conectando…" : "Conectar Freighter"}
                </Button>
                {walletTemp && (
                  <Button type="button" variant="primary" onClick={handleLinkWallet}>
                    Vincular
                  </Button>
                )}
              </div>
              {walletTemp && (
                <p className="text-xs font-mono text-[var(--black)]/70 break-all">{walletTemp}</p>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-[var(--black)]/70">Cargando...</p></div>}>
      <ProfileContent />
    </Suspense>
  );
}
