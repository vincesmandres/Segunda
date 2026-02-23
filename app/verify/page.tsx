"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Label, Card } from "@/components/ui";

const STORAGE_KEY = "segunda_last_issued";

interface StoredData {
  hash: string;
  issuer_name: string;
  subject_name: string;
  program: string;
  date: string;
  internal_id: string;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const hashFromUrl = searchParams.get("hash") ?? "";
  const [hash, setHash] = useState(hashFromUrl);
  const [result, setResult] = useState<"valid" | "invalid" | null>(null);
  const [data, setData] = useState<StoredData | null>(null);

  useEffect(() => {
    if (hashFromUrl) setHash(hashFromUrl);
  }, [hashFromUrl]);

  const handleVerify = () => {
    if (!hash.trim()) return;
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (!stored) {
      setResult("invalid");
      setData(null);
      return;
    }
    const parsed: StoredData = JSON.parse(stored);
    if (parsed.hash === hash.trim()) {
      setResult("valid");
      setData(parsed);
    } else {
      setResult("invalid");
      setData(null);
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
            <Button variant="primary" onClick={handleVerify}>
              Verificar
            </Button>
          </div>

          {result === "valid" && data && (
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
                  <dd className="font-medium">{data.issuer_name}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Subject</dt>
                  <dd className="font-medium">{data.subject_name}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Program</dt>
                  <dd className="font-medium">{data.program}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Date</dt>
                  <dd className="font-medium">{data.date}</dd>
                </div>
                <div>
                  <dt className="text-[var(--black)]/70">Internal ID</dt>
                  <dd className="font-medium">{data.internal_id}</dd>
                </div>
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
              <p className="text-sm text-[var(--black)]/70 mt-2">
                El hash no coincide con ningún certificado emitido en esta sesión.
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
