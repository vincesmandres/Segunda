"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Label, Card } from "@/components/ui";

interface RecordPayload {
  issuer_name: string;
  subject_name: string;
  program: string;
  date: string;
  internal_id: string;
}

interface RecordItem {
  hash: string;
  payload: RecordPayload;
  created_at: string;
  anchored: boolean;
  tx_id: string | null;
  stellar_url: string | null;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const hashFromUrl = searchParams.get("hash") ?? "";
  const [hash, setHash] = useState(hashFromUrl);
  const [result, setResult] = useState<"valid" | "invalid" | null>(null);
  const [record, setRecord] = useState<RecordItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hashFromUrl) setHash(hashFromUrl);
  }, [hashFromUrl]);

  const handleVerify = async () => {
    if (!hash.trim()) return;
    setLoading(true);
    setResult(null);
    setRecord(null);
    try {
      const res = await fetch("/api/v1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: hash.trim() }),
      });
      const data = await res.json();
      if (data.valid && data.record) {
        setResult("valid");
        setRecord(data.record);
      } else {
        setResult("invalid");
      }
    } catch {
      setResult("invalid");
    } finally {
      setLoading(false);
    }
  };

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
            VERIFICAR CERTIFICADO
          </h1>

          <div className="space-y-4">
            <Label htmlFor="hash">Hash</Label>
            <Input
              id="hash"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Introduce el hash del certificado"
            />
            <Button variant="primary" onClick={handleVerify} disabled={loading}>
              {loading ? "Verificando…" : "Verificar"}
            </Button>
          </div>

          {result === "valid" && record && (
            <div className="space-y-4 pt-4 border-t-2 border-[var(--black)]">
              <p
                className="font-[var(--font-pixel)] text-sm text-green-700"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                VALID
              </p>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-[var(--black)]/70">Issuer</dt>
                  <dd className="font-medium">{record.payload.issuer_name}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Subject</dt>
                  <dd className="font-medium">{record.payload.subject_name}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Program</dt>
                  <dd className="font-medium">{record.payload.program}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Date</dt>
                  <dd className="font-medium">{record.payload.date}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Internal ID</dt>
                  <dd className="font-medium">{record.payload.internal_id}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Anchored</dt>
                  <dd className="font-medium">{record.anchored ? "true" : "false"}</dd>
                </div>
                {record.tx_id && record.stellar_url && (
                  <>
                    <div>
                      <dt className="text-[var(--black)]/70">Tx ID</dt>
                      <dd className="font-medium break-all">{record.tx_id}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--black)]/70">Stellar</dt>
                      <dd>
                        <a
                          href={record.stellar_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline hover:no-underline break-all"
                        >
                          {record.stellar_url}
                        </a>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          )}

          {result === "invalid" && (
            <div className="pt-4 border-t-2 border-[var(--black)]">
              <p
                className="font-[var(--font-pixel)] text-sm text-red-700"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                INVALID
              </p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--black)]/70">Cargando...</p>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
