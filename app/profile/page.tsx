"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { requestAccess, getAddress, signMessage } from "@stellar/freighter-api";
import { createClient } from "@/lib/supabase/client";
import { Button, Label, Card } from "@/components/ui";
import { WalletOnboardingModal } from "@/components/WalletOnboardingModal";
import { QRCodeSVG } from "qrcode.react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  wallet_public: string | null;
  subject_profile_token: string | null;
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
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryRevealLoading, setRecoveryRevealLoading] = useState(false);
  const [recoveryRevealError, setRecoveryRevealError] = useState<string | null>(null);
  const [profileTokenInput, setProfileTokenInput] = useState("");
  const [profileTokenSaving, setProfileTokenSaving] = useState(false);
  const [profileTokenError, setProfileTokenError] = useState<string | null>(null);
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
      .select("id, email, full_name, avatar_url, wallet_public, subject_profile_token")
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
        subject_profile_token: null,
      });
      return;
    }

    if (error) console.error("[profile/page] load profile error", (error as { message: string }).message);
    setProfile({
      ...data,
      subject_profile_token: (data as { subject_profile_token?: string | null }).subject_profile_token ?? null,
    });

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

  const handleRevealSecretWithWallet = useCallback(async () => {
    if (!profile?.wallet_public || !storedSecret) return;
    setRecoveryRevealError(null);
    setRecoveryRevealLoading(true);
    try {
      const message = `Segunda - Revelar clave de recuperación - ${new Date().toISOString().slice(0, 10)}`;
      const result = await signMessage(message, { address: profile.wallet_public });
      if (result.error) {
        setRecoveryRevealError(result.error.message ?? "Freighter rechazó la solicitud");
        return;
      }
      if ((result.signerAddress ?? "").trim() !== profile.wallet_public.trim()) {
        setRecoveryRevealError("La wallet que firmó no coincide con la vinculada. Usa la wallet de este perfil.");
        return;
      }
      setSecretVisible(true);
    } catch (e) {
      setRecoveryRevealError(e instanceof Error ? e.message : "Error al solicitar permiso");
    } finally {
      setRecoveryRevealLoading(false);
    }
  }, [profile?.wallet_public, storedSecret]);

  const handleSaveProfileToken = async () => {
    const token = profileTokenInput.trim();
    setProfileTokenError(null);
    setProfileTokenSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject_profile_token: token || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileTokenError(data?.details ?? data?.error ?? "Error al guardar");
        return;
      }
      setProfileTokenInput("");
      await fetchProfile();
    } finally {
      setProfileTokenSaving(false);
    }
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

                {/* Recovery key: desplegable y revelar solo con permiso de la wallet (estilo Metamask) */}
                {storedSecret !== null && (
                  <div className="border-2 border-[var(--black)] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setRecoveryOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-2 py-3 px-4 bg-[var(--beige)] hover:bg-[var(--black)]/5 text-left text-sm font-[var(--font-pixel)]"
                    >
                      <span>Clave secreta (recovery)</span>
                      <span className="text-[var(--black)]/70">{recoveryOpen ? "▼" : "▶"}</span>
                    </button>
                    {recoveryOpen && (
                      <div className="p-4 pt-0 space-y-3 bg-[var(--white)] border-t-2 border-[var(--black)]">
                        {secretVisible ? (
                          <p className="font-mono text-xs break-all bg-red-50 border-2 border-red-400 p-3 select-all">
                            {storedSecret}
                          </p>
                        ) : (
                          <>
                            <p className="text-xs text-[var(--black)]/70">
                              Para ver la clave, Freighter te pedirá que firmes un mensaje (como en MetaMask). Solo la wallet vinculada a este perfil puede revelarla.
                            </p>
                            <button
                              type="button"
                              onClick={handleRevealSecretWithWallet}
                              disabled={recoveryRevealLoading}
                              className="w-full text-sm py-2 px-4 border-2 border-[var(--black)] bg-amber-100 text-amber-900 hover:bg-amber-200 disabled:opacity-50 font-[var(--font-pixel)]"
                            >
                              {recoveryRevealLoading ? "Abre Freighter para firmar…" : "Revelar clave (confirmar en Freighter)"}
                            </button>
                            {recoveryRevealError && (
                              <p className="text-xs text-red-600">{recoveryRevealError}</p>
                            )}
                          </>
                        )}
                        <p className="text-xs text-[var(--black)]/60">
                          ⚠️ Solo almacenada en este navegador. Guárdala en un lugar seguro.
                        </p>
                      </div>
                    )}
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

          {/* QR de verificación del perfil de certificaciones */}
          <div className="border-t-2 border-[var(--black)] pt-4 space-y-3">
            <h2
              className="text-sm font-[var(--font-pixel)]"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              VERIFICAR MI PERFIL (QR)
            </h2>
            {profile.subject_profile_token ? (
              <div className="flex flex-col items-start gap-2">
                <p className="text-sm text-[var(--black)]/70">
                  Escanea este QR para abrir tu perfil público de certificaciones.
                </p>
                <div className="bg-white p-3 border-2 border-[var(--black)] inline-block">
                  <QRCodeSVG
                    value={typeof window !== "undefined" ? `${window.location.origin}/perfil-certificado/${profile.subject_profile_token}` : ""}
                    size={180}
                    level="M"
                  />
                </div>
                <p className="text-xs font-mono break-all text-[var(--black)]/70">
                  {typeof window !== "undefined" ? `${window.location.origin}/perfil-certificado/${profile.subject_profile_token}` : ""}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    setProfileTokenInput("");
                    const res = await fetch("/api/profile", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ subject_profile_token: null }),
                    });
                    if (res.ok) await fetchProfile();
                  }}
                  disabled={profileTokenSaving}
                >
                  Quitar QR
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-[var(--black)]/70">
                  Si tienes un perfil de certificaciones (te dieron un enlace tipo /perfil-certificado/XXXX), pega aquí el código para mostrar tu QR.
                </p>
                <div className="flex gap-2 flex-wrap items-center">
                  <input
                    type="text"
                    value={profileTokenInput}
                    onChange={(e) => setProfileTokenInput(e.target.value)}
                    placeholder="Ej: ABCDEF12345678"
                    className="flex-1 min-w-[120px] px-3 py-2 border-2 border-[var(--black)] bg-[var(--white)] text-sm font-mono"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSaveProfileToken}
                    disabled={profileTokenSaving || !profileTokenInput.trim()}
                  >
                    {profileTokenSaving ? "Guardando…" : "Añadir y mostrar QR"}
                  </Button>
                </div>
                {profileTokenError && <p className="text-xs text-red-600">{profileTokenError}</p>}
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
