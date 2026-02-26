"use client";

import { useState, useCallback, useEffect } from "react";
import { signTransaction } from "@stellar/freighter-api";
import { Button, Input, Label, Card } from "@/components/ui";
import { useWallet } from "@/components/WalletProvider";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

interface IssuerStatus {
  allowed: boolean;
  status?: string;
  display_name?: string;
}
const NETWORK_PASSPHRASES = {
  testnet: "Test SDF Network ; September 2015",
  public: "Public Global Stellar Network ; September 2015",
} as const;

interface IssueApiResponse {
  hash: string;
  verify_url: string;
  created_at: string;
  anchored: boolean;
  tx_id: string | null;
  stellar_url: string | null;
  unsigned_xdr: string | null;
  network: "testnet" | "public";
}

export default function IssuePage() {
  const [issuer_name, setIssuerName] = useState("");
  const [subject_name, setSubjectName] = useState("");
  const [program, setProgram] = useState("");
  const [date, setDate] = useState("");
  const [internal_id, setInternalId] = useState("");
  const [issued, setIssued] = useState<IssueApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState<"idle" | "issuing" | "signing" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  const { address: issuerPublic, isAvailable: freighterAvailable } = useWallet();
  const [issuerStatus, setIssuerStatus] = useState<IssuerStatus | null>(null);

  useEffect(() => {
    if (!issuerPublic) {
      setIssuerStatus(null);
      return;
    }
    const fn = async () => {
      // #region agent log
      fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4b702e'},body:JSON.stringify({sessionId:'4b702e',location:'issue/page.tsx:useEffect',message:'fetching issuer status',data:{issuerPublicSuffix:issuerPublic.slice(-8),issuerPublicLen:issuerPublic.length},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      try {
        const res = await fetch(
          `/api/v1/issuer-status?issuer_public=${encodeURIComponent(issuerPublic)}`,
          { credentials: "include" }
        );
        const data = await res.json();

        // #region agent log
        fetch('http://127.0.0.1:7381/ingest/4d3f4015-8d8c-4a6b-a4ca-febc0697e8d5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4b702e'},body:JSON.stringify({sessionId:'4b702e',location:'issue/page.tsx:issuer-status-response',message:'issuer status response',data:{ok:res.ok,allowed:data?.allowed,status:data?.status,hasError:!!data?.error},timestamp:Date.now()})}).catch(()=>{});
        // #endregion

        setIssuerStatus({
          allowed: data.allowed ?? false,
          status: data.status,
          display_name: data.display_name,
        });
      } catch {
        setIssuerStatus({ allowed: false });
      }
    };
    fn();
  }, [issuerPublic]);

  const isIssuerActive = issuerStatus?.allowed ?? false;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setLoadStep("issuing");

      const payload = {
        issuer_name,
        subject_name,
        program,
        date,
        internal_id,
      };

      try {
        const hasWallet = !!issuerPublic;
        const sendIssuerPublic = DEMO_MODE ? (hasWallet ? issuerPublic : undefined) : issuerPublic;

        if (!DEMO_MODE && !issuerPublic) {
          setError("Conecta Freighter para anclar el certificado.");
          setLoading(false);
          setLoadStep("idle");
          return;
        }

        const issueRes = await fetch("/api/v1/issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            ...(sendIssuerPublic ? { issuer_public: sendIssuerPublic } : {}),
          }),
        });
        const data = (await issueRes.json()) as IssueApiResponse & { error?: string; details?: string };

        if (!issueRes.ok) {
          setError(data?.details ?? data?.error ?? "Error al emitir");
          setLoading(false);
          setLoadStep("idle");
          return;
        }

        if (!data.unsigned_xdr) {
          setIssued({
            ...data,
            anchored: false,
            tx_id: null,
            stellar_url: null,
          });
          setLoading(false);
          setLoadStep("idle");
          return;
        }

        setLoadStep("signing");
        const passphrase = NETWORK_PASSPHRASES[data.network] ?? NETWORK_PASSPHRASES.testnet;
        const signRes = await signTransaction(data.unsigned_xdr, {
          networkPassphrase: passphrase,
          address: issuerPublic || undefined,
        });

        if (signRes.error || !signRes.signedTxXdr) {
          setError(signRes.error?.message ?? "Error al firmar la transacción");
          setIssued(data);
          setLoading(false);
          setLoadStep("idle");
          return;
        }

        setLoadStep("submitting");
        const submitRes = await fetch("/api/v1/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hash: data.hash, signed_xdr: signRes.signedTxXdr }),
        });
        const submitData = (await submitRes.json()) as {
          anchored?: boolean;
          tx_id?: string;
          stellar_url?: string;
          error?: string;
          details?: string;
        };

        if (!submitRes.ok) {
          setError(submitData?.details ?? submitData?.error ?? "Error al enviar la transacción");
          setIssued(data);
          setLoading(false);
          setLoadStep("idle");
          return;
        }

        setIssued({
          ...data,
          anchored: submitData.anchored ?? true,
          tx_id: submitData.tx_id ?? null,
          stellar_url: submitData.stellar_url ?? null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error de conexión");
      } finally {
        setLoading(false);
        setLoadStep("idle");
      }
    },
    [issuer_name, subject_name, program, date, internal_id, issuerPublic]
  );

  const copyVerifyUrl = useCallback(() => {
    if (issued?.verify_url && typeof navigator?.clipboard !== "undefined") {
      const fullUrl =
        typeof window !== "undefined" ? `${window.location.origin}${issued.verify_url}` : issued.verify_url;
      navigator.clipboard.writeText(fullUrl);
    }
  }, [issued?.verify_url]);

  if (issued) {
    return (
      <div className="flex-1 flex flex-col">
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
              {!issued.unsigned_xdr && (
                <p className="text-sm text-[var(--black)]/70">Emitido sin anclaje.</p>
              )}
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

  const stepLabel =
    loadStep === "issuing"
      ? "Emitiendo…"
      : loadStep === "signing"
        ? "Firmando…"
        : loadStep === "submitting"
          ? "Enviando a Stellar…"
          : "Emitir";

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <Card className="max-w-lg w-full">
          <h1
            className="text-lg font-[var(--font-pixel)] mb-8"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            EMITIR CERTIFICADO
          </h1>

          {issuerPublic && (
            <div className="mb-6">
              <p className="text-sm">
                Issuer status:{" "}
                {issuerStatus === null ? (
                  <span className="text-[var(--black)]/60">Verificando…</span>
                ) : isIssuerActive ? (
                  <span className="text-green-700 font-medium">active</span>
                ) : (
                  <span className="text-red-600 font-medium">
                    {issuerStatus.status === "disabled" ? "disabled" : "not registered"}
                  </span>
                )}
              </p>
            </div>
          )}

          {freighterAvailable === false && !DEMO_MODE && (
            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded text-sm">
              <p className="font-medium text-amber-800">Freighter no está instalado</p>
              <p className="text-amber-700 mt-1">
                Para anclar certificados en Stellar necesitas la extensión{" "}
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Freighter
                </a>
                . Instálala y recarga la página.
              </p>
            </div>
          )}

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
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={
                loading || (!DEMO_MODE && !issuerPublic)
              }
              >
                {loading ? stepLabel : DEMO_MODE && !issuerPublic ? "Emitir (sin anclaje)" : "Emitir"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
