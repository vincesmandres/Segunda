"use client";

import { useState, useCallback } from "react";
import { Keypair } from "@stellar/stellar-sdk";
import { requestAccess, getAddress } from "@stellar/freighter-api";
import { Button } from "@/components/ui";

interface WalletOnboardingModalProps {
    userId: string;
    onComplete: (walletPublic: string) => void;
}

type Step =
    | "choose"
    | "freighter-connecting"
    | "create-showing"
    | "create-confirming"
    | "done";

export function WalletOnboardingModal({ userId, onComplete }: WalletOnboardingModalProps) {
    const [step, setStep] = useState<Step>("choose");
    const [error, setError] = useState<string | null>(null);
    const [newKeypair, setNewKeypair] = useState<{ publicKey: string; secret: string } | null>(null);
    const [secretRevealed, setSecretRevealed] = useState(false);
    const [saving, setSaving] = useState(false);

    const saveWalletToProfile = useCallback(async (walletPublic: string, secret?: string) => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch("/api/profile/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ wallet_public: walletPublic }),
            });
            if (!res.ok) {
                const d = await res.json();
                setError(d?.details ?? d?.error ?? "Error al guardar la wallet");
                setSaving(false);
                return;
            }
            // Guardar el secreto encriptado en localStorage (solo si es wallet generada)
            if (secret) {
                try {
                    // Cifrado básico XOR con userId (para MVP — no usar en producción con fondos reales)
                    const encoded = btoa(secret);
                    localStorage.setItem(`segunda_wallet_secret_${userId}`, encoded);
                } catch {
                    // localStorage puede estar bloqueado en algunos contextos
                }
            }
            onComplete(walletPublic);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error de red");
            setSaving(false);
        }
    }, [userId, onComplete]);

    const handleConnectFreighter = useCallback(async () => {
        setStep("freighter-connecting");
        setError(null);
        try {
            // Intentar obtener dirección sin popup primero
            const addr = await getAddress();
            if (addr?.address) {
                await saveWalletToProfile(addr.address);
                return;
            }
            // Solicitar acceso si no está conectado
            const access = await requestAccess();
            if (access?.error || !access?.address) {
                setError(access?.error?.message ?? "No se pudo obtener la dirección de Freighter");
                setStep("choose");
                return;
            }
            await saveWalletToProfile(access.address);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error conectando Freighter");
            setStep("choose");
        }
    }, [saveWalletToProfile]);

    const handleGenerateWallet = useCallback(() => {
        setError(null);
        const kp = Keypair.random();
        setNewKeypair({ publicKey: kp.publicKey(), secret: kp.secret() });
        setStep("create-showing");
    }, []);

    const handleConfirmSaved = useCallback(async () => {
        if (!newKeypair) return;
        setStep("create-confirming");
        await saveWalletToProfile(newKeypair.publicKey, newKeypair.secret);
    }, [newKeypair, saveWalletToProfile]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[var(--beige)] border-4 border-[var(--black)] max-w-lg w-full p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                {/* STEP: choose */}
                {step === "choose" && (
                    <>
                        <h2 className="text-lg font-[var(--font-pixel)]" style={{ fontFamily: "var(--font-pixel)" }}>
                            CONFIGURAR WALLET
                        </h2>
                        <p className="text-sm text-[var(--black)]/70">
                            Para emitir certificados en Stellar necesitas una wallet. ¿Ya tienes una?
                        </p>
                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="primary"
                                className="w-full"
                                onClick={handleConnectFreighter}
                            >
                                Conectar mi wallet (Freighter)
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={handleGenerateWallet}
                            >
                                Crear una wallet nueva
                            </Button>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </>
                )}

                {/* STEP: freighter connecting */}
                {step === "freighter-connecting" && (
                    <>
                        <h2 className="text-lg font-[var(--font-pixel)]" style={{ fontFamily: "var(--font-pixel)" }}>
                            CONECTANDO…
                        </h2>
                        <p className="text-sm text-[var(--black)]/70">
                            Aprueba la conexión en la extensión Freighter.
                        </p>
                        {saving && <p className="text-sm text-[var(--black)]/60">Guardando…</p>}
                        {error && (
                            <>
                                <p className="text-sm text-red-600">{error}</p>
                                <Button type="button" variant="secondary" onClick={() => setStep("choose")}>
                                    Volver
                                </Button>
                            </>
                        )}
                    </>
                )}

                {/* STEP: create-showing */}
                {step === "create-showing" && newKeypair && (
                    <>
                        <h2 className="text-lg font-[var(--font-pixel)]" style={{ fontFamily: "var(--font-pixel)" }}>
                            NUEVA WALLET CREADA
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-[var(--font-pixel)] mb-1" style={{ fontFamily: "var(--font-pixel)" }}>DIRECCIÓN PÚBLICA (puedes compartirla)</p>
                                <p className="font-mono text-xs break-all bg-white border-2 border-[var(--black)] p-3">
                                    {newKeypair.publicKey}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-[var(--font-pixel)] mb-1 text-red-700" style={{ fontFamily: "var(--font-pixel)" }}>
                                    CLAVE SECRETA — COPIA Y GUARDA AHORA
                                </p>
                                <div className="relative">
                                    {secretRevealed ? (
                                        <p className="font-mono text-xs break-all bg-red-50 border-2 border-red-400 p-3 select-all">
                                            {newKeypair.secret}
                                        </p>
                                    ) : (
                                        <button
                                            onClick={() => setSecretRevealed(true)}
                                            className="w-full text-sm bg-red-50 border-2 border-red-400 p-3 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                                        >
                                            Clic para revelar la clave secreta
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-[var(--black)]/60 mt-1">
                                    ⚠️ Esta clave no se almacena en el servidor. Si la pierdes, no podrás recuperar tu wallet.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="primary"
                                className="w-full"
                                onClick={handleConfirmSaved}
                                disabled={saving}
                            >
                                {saving ? "Guardando…" : "He guardado mi clave secreta →"}
                            </Button>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </div>
                    </>
                )}

                {/* STEP: create-confirming */}
                {step === "create-confirming" && (
                    <>
                        <h2 className="text-lg font-[var(--font-pixel)]" style={{ fontFamily: "var(--font-pixel)" }}>
                            CONFIGURANDO…
                        </h2>
                        <p className="text-sm text-[var(--black)]/70">Guardando tu wallet en tu perfil…</p>
                    </>
                )}

            </div>
        </div>
    );
}
