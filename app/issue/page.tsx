"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button, Input, Label, Card } from "@/components/ui";

interface IssueApiResponse {
  hash: string;
  verify_url: string;
  created_at: string;
  anchored: boolean;
  tx_id: string | null;
  stellar_url: string | null;
}

export default function IssuePage() {
  const [issuer_name, setIssuerName] = useState("");
  const [subject_name, setSubjectName] = useState("");
  const [program, setProgram] = useState("");
  const [date, setDate] = useState("");
  const [internal_id, setInternalId] = useState("");
  const [issued, setIssued] = useState<IssueApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            issuer_name,
            subject_name,
            program,
            date,
            internal_id,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.details ?? data?.error ?? "Error al emitir");
          return;
        }
        setIssued(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error de conexión");
      } finally {
        setLoading(false);
      }
    },
    [issuer_name, subject_name, program, date, internal_id]
  );

  const copyVerifyUrl = useCallback(() => {
    if (issued?.verify_url && typeof navigator?.clipboard !== "undefined") {
      const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${issued.verify_url}` : issued.verify_url;
      navigator.clipboard.writeText(fullUrl);
    }
  }, [issued?.verify_url]);

  if (issued) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b-2 border-[var(--black)] py-4 px-6">
          <Link
            href="/"
            className="font-[var(--font-pixel)] text-sm"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            SEGUNDA
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <Card className="max-w-lg w-full space-y-8">
            <h1
              className="text-lg font-[var(--font-pixel)]"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              CERTIFICADO EMITIDO
            </h1>
            <div className="space-y-4">
              <div>
                <Label>Hash</Label>
                <p className="font-mono text-sm break-all bg-[var(--beige)] p-3 border-2 border-[var(--black)]">
                  {issued.hash}
                </p>
              </div>
              <div>
                <Label>Anchored</Label>
                <p className="text-sm">{issued.anchored ? "true" : "false"}</p>
              </div>
              {issued.tx_id && issued.stellar_url && (
                <div>
                  <Label>Stellar</Label>
                  <a
                    href={issued.stellar_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline hover:no-underline break-all"
                  >
                    {issued.stellar_url}
                  </a>
                </div>
              )}
              <div>
                <Label>Verify URL</Label>
                <p className="text-sm text-[var(--black)]/70 break-all mb-2">
                  {issued.verify_url}
                </p>
                <Button variant="primary" onClick={copyVerifyUrl}>
                  Copiar
                </Button>
              </div>
              <div>
                <Button variant="secondary" href={issued.verify_url}>
                  Ir a verificar
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b-2 border-[var(--black)] py-4 px-6">
        <Link
          href="/"
          className="font-[var(--font-pixel)] text-sm"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          SEGUNDA
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <Card className="max-w-lg w-full">
          <h1
            className="text-lg font-[var(--font-pixel)] mb-8"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            EMITIR CERTIFICADO
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="issuer_name">Issuer name</Label>
              <Input
                id="issuer_name"
                value={issuer_name}
                onChange={(e) => setIssuerName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="subject_name">Subject name</Label>
              <Input
                id="subject_name"
                value={subject_name}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="program">Program</Label>
              <Input
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="internal_id">Internal ID</Label>
              <Input
                id="internal_id"
                value={internal_id}
                onChange={(e) => setInternalId(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <div className="pt-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Emitiendo…" : "Emitir"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
