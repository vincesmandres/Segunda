"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, Button, Label } from "@/components/ui";
import { QRCodeSVG } from "qrcode.react";

type Profile = {
  token: string;
  subject_name: string;
  internal_id: string;
  created_at: string;
};

type CertLink = { hash: string; created_at: string };

export default function PerfilCertificadoPage() {
  const params = useParams();
  const token = (params?.token as string) ?? "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [certificates, setCertificates] = useState<CertLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Token no válido");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/v1/subject-profile/${encodeURIComponent(token)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data?.details ?? "Perfil no encontrado");
          return;
        }
        setProfile(data.profile);
        setCertificates(data.certificates ?? []);
      } catch {
        if (!cancelled) setError("Error al cargar el perfil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const profileUrl = `${baseUrl}/perfil-certificado/${token}`;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <p className="text-sm text-[var(--black)]/70">Cargando perfil…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <Card className="max-w-md w-full text-center space-y-4">
          <h1 className="text-lg font-[var(--font-pixel)]">Perfil no encontrado</h1>
          <p className="text-sm text-red-600">{error ?? "El enlace no es válido."}</p>
          <Button variant="secondary" href="/">
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto px-6 py-16 space-y-8">
        <Card className="w-full space-y-6">
          <h1
            className="text-lg font-[var(--font-pixel)]"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            PERFIL DE CERTIFICACIONES
          </h1>
          <div>
            <Label>Nombre</Label>
            <p className="text-base font-medium">{profile.subject_name}</p>
          </div>
          {profile.internal_id && (
            <div>
              <Label>ID interno</Label>
              <p className="font-mono text-sm">{profile.internal_id}</p>
            </div>
          )}

          <div className="flex flex-col items-start gap-4">
            <Label>QR de verificación (perfil completo)</Label>
            <p className="text-sm text-[var(--black)]/70">
              Escanea para ver este perfil desde la app o el navegador.
            </p>
            <div className="bg-white p-3 border-2 border-[var(--black)] inline-block">
              <QRCodeSVG value={profileUrl} size={180} level="M" />
            </div>
            <p className="text-xs font-mono break-all text-[var(--black)]/70">{profileUrl}</p>
          </div>
        </Card>

        <Card className="w-full space-y-4">
          <h2 className="text-base font-[var(--font-pixel)]">Certificados ({certificates.length})</h2>
          {certificates.length === 0 ? (
            <p className="text-sm text-[var(--black)]/70">Aún no hay certificados en este perfil.</p>
          ) : (
            <ul className="space-y-3">
              {certificates.map((c) => (
                <li
                  key={c.hash}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[var(--beige)] border-2 border-[var(--black)]"
                >
                  <span className="font-mono text-sm break-all">{c.hash}</span>
                  <Link
                    href={`/verify?hash=${encodeURIComponent(c.hash)}`}
                    className="text-sm underline hover:no-underline"
                  >
                    Verificar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="flex justify-center">
          <Button variant="secondary" href="/">
            Ir al inicio
          </Button>
        </div>
      </main>
    </div>
  );
}
