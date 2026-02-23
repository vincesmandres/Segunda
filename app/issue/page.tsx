"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button, Input, Label, Card } from "@/components/ui";
import { fakeHash } from "@/lib/hash-client";

const STORAGE_KEY = "segunda_last_issued";

interface IssuedData {
  hash: string;
  issuer_name: string;
  subject_name: string;
  program: string;
  date: string;
  internal_id: string;
}

export default function IssuePage() {
  const [issuer_name, setIssuerName] = useState("");
  const [subject_name, setSubjectName] = useState("");
  const [program, setProgram] = useState("");
  const [date, setDate] = useState("");
  const [internal_id, setInternalId] = useState("");
  const [issued, setIssued] = useState<IssuedData | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const payload = JSON.stringify({
        issuer_name,
        subject_name,
        program,
        date,
        internal_id,
      });
      const hash = fakeHash(payload);
      const data: IssuedData = {
        hash,
        issuer_name,
        subject_name,
        program,
        date,
        internal_id,
      };
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      setIssued(data);
    },
    [issuer_name, subject_name, program, date, internal_id]
  );

  const copyHash = useCallback(() => {
    if (issued?.hash && typeof navigator?.clipboard !== "undefined") {
      navigator.clipboard.writeText(issued.hash);
    }
  }, [issued?.hash]);

  if (issued) {
    const verifyUrl = `/verify?hash=${encodeURIComponent(issued.hash)}`;
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
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={copyHash}>
                  Copy
                </Button>
                <Button variant="secondary" href={verifyUrl}>
                  Ir a verificar
                </Button>
              </div>
              <p className="text-sm text-[var(--black)]/70 break-all">
                <Link href={verifyUrl} className="underline hover:no-underline">
                  {verifyUrl}
                </Link>
              </p>
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
            <div className="pt-2">
              <Button type="submit" variant="primary">
                Emitir
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
