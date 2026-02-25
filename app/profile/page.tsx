"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { requestAccess, getAddress } from "@stellar/freighter-api";
import { createClient } from "@/lib/supabase/client";
import { Button, Label, Card } from "@/components/ui";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  wallet_public: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletTemp, setWalletTemp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
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

    if (error) {
      console.error("[profile/page] load profile error", error.message);
    }

    if (!data) {
      // Fallback: si aún no existe fila en profiles, usar los datos del user
      setProfile({
        id: user.id,
        email: user.email ?? null,
        full_name:
          (user.user_metadata as any)?.full_name ??
          (user.user_metadata as any)?.name ??
          null,
        avatar_url:
          (user.user_metadata as any)?.avatar_url ??
          (user.user_metadata as any)?.picture ??
          null,
        wallet_public: null,
      });
      return;
    }

    setProfile(data);
  }, [router]);

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, [fetchProfile]);

  // Si no hay wallet vinculada, intentar detectar Freighter y vincular automáticamente (una vez por visita)
  useEffect(() => {
    if (!profile || profile.wallet_public || autoLinkAttempted.current) return;

    const tryAutoLink = async () => {
      autoLinkAttempted.current = true;
      setWalletLoading(true);
      setError(null);
      try {
        // Solo vincular si Freighter ya está conectado (getAddress). No abrir popup con requestAccess.
        const addr = await getAddress();
        const address = addr?.address?.trim();
        if (!address) {
          setWalletLoading(false);
          return;
        }
        const res = await fetch("/api/profile/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ wallet_public: address.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.details ?? data?.error ?? "Error al vincular");
          setWalletTemp(address);
          setWalletLoading(false);
          return;
        }
        setWalletTemp("");
        await fetchProfile();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al conectar");
      } finally {
        setWalletLoading(false);
      }
    };

    tryAutoLink();
  }, [profile, fetchProfile]);

  const handleConnectFreighter = async () => {
    setWalletLoading(true);
    setError(null);
    try {
      const addr = await getAddress();
      if (addr?.address) {
        setWalletTemp(addr.address);
      } else {
        const access = await requestAccess();
        if (access?.address) {
          setWalletTemp(access.address);
        } else {
          setError("No se pudo obtener la dirección");
        }
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
    try {
      const res = await fetch("/api/profile/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ wallet_public: walletTemp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.details ?? data?.error ?? "Error al vincular");
        return;
      }
      setWalletTemp("");
      await fetchProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  const handleUnlinkWallet = async () => {
    setError(null);
    try {
      const res = await fetch("/api/profile/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ wallet_public: null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.details ?? data?.error ?? "Error al desvincular");
        return;
      }
      await fetchProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
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
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <Card className="max-w-lg w-full space-y-6">
        <h1
          className="text-lg font-[var(--font-pixel)]"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          MI PERFIL
        </h1>

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

        <div>
          <Label>Wallet</Label>
          <p className="font-mono text-sm break-all bg-[var(--beige)] p-3 border-2 border-[var(--black)]">
            {profile.wallet_public ?? "(no vinculada)"}
          </p>
          {profile.wallet_public && (
            <div className="mt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleUnlinkWallet}
              >
                Desvincular de mi perfil
              </Button>
            </div>
          )}
        </div>

        <div className="border-t-2 border-[var(--black)] pt-4 space-y-4">
          <h2
            className="text-sm font-[var(--font-pixel)]"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            Conectar Wallet (Freighter)
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
              <Button
                type="button"
                variant="primary"
                onClick={handleLinkWallet}
              >
                Vincular a mi perfil
              </Button>
            )}
          </div>
          {walletTemp && (
            <p className="text-xs font-mono text-[var(--black)]/70 break-all">
              {walletTemp}
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </Card>
    </div>
  );
}
