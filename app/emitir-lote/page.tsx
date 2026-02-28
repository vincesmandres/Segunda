"use client";

import { useState, useCallback } from "react";
import { Button, Card, Label } from "@/components/ui";
import { useWallet } from "@/components/WalletProvider";
import type { IssueInput } from "@/lib/canonicalize";

type BulkResult = {
  hash: string;
  verify_url: string;
  profile_url: string | null;
  subject_name: string;
  internal_id: string;
  error?: string;
};

const CSV_HEADERS = [
  "issuer_name",
  "subject_name",
  "program",
  "date",
  "internal_id",
] as const;

function parseCSV(text: string): IssueInput[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headerLine = lines[0];
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const rows: IssueInput[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? "";
    });
    const issuer_name = row.issuer_name ?? "";
    const subject_name = row.subject_name ?? "";
    const program = row.program ?? "";
    const date = row.date ?? "";
    const internal_id = row.internal_id ?? "";
    if (subject_name || program || date) {
      rows.push({
        issuer_name: issuer_name || "Issuer",
        subject_name,
        program,
        date,
        internal_id,
      });
    }
  }
  return rows;
}

export default function EmitirLotePage() {
  const { address: issuerPublic } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<IssueInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BulkResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      setFile(f ?? null);
      setResults(null);
      setError(null);
      if (!f) {
        setRows([]);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result ?? "");
          const parsed = parseCSV(text);
          setRows(parsed);
          if (parsed.length === 0) setError("No se encontraron filas válidas en el CSV.");
        } catch {
          setError("Error al leer el CSV.");
          setRows([]);
        }
      };
      reader.readAsText(f, "UTF-8");
    },
    []
  );

  const handleBulkIssue = useCallback(async () => {
    if (rows.length === 0) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/v1/issue-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows,
          ...(issuerPublic ? { issuer_public: issuerPublic } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.details ?? data?.error ?? "Error en emisión en lote");
        return;
      }
      setResults(data.results ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [rows, issuerPublic]);

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 space-y-8">
        <Card className="w-full space-y-6">
          <h1
            className="text-lg font-[var(--font-pixel)]"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            EMITIR CERTIFICADOS EN LOTE
          </h1>
          <p className="text-sm text-[var(--black)]/80">
            Sube un archivo CSV con columnas:{" "}
            <code className="bg-[var(--beige)] px-1">issuer_name</code>,{" "}
            <code className="bg-[var(--beige)] px-1">subject_name</code>,{" "}
            <code className="bg-[var(--beige)] px-1">program</code>,{" "}
            <code className="bg-[var(--beige)] px-1">date</code>,{" "}
            <code className="bg-[var(--beige)] px-1">internal_id</code> (opcional).
            Los certificados se crearán sin anclar en Stellar (solo registro y perfil).
          </p>
          <div>
            <Label>Archivo CSV</Label>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={onFileChange}
              className="mt-2 block w-full text-sm"
            />
          </div>
          {/* Próximamente: búsqueda en Google Drive */}
          <p className="text-xs text-[var(--black)]/60">
            Próximamente: búsqueda de archivos en Google Drive para importar CSV.
          </p>
        </Card>

        {rows.length > 0 && !results && (
          <Card className="w-full space-y-4">
            <h2 className="text-base font-[var(--font-pixel)]">
              Vista previa ({rows.length} filas)
            </h2>
            <div className="overflow-x-auto max-h-64 overflow-y-auto border-2 border-[var(--black)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--beige)] border-b-2 border-[var(--black)]">
                    <th className="text-left p-2">subject_name</th>
                    <th className="text-left p-2">program</th>
                    <th className="text-left p-2">date</th>
                    <th className="text-left p-2">internal_id</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((r, i) => (
                    <tr key={i} className="border-b border-[var(--black)]/20">
                      <td className="p-2">{r.subject_name}</td>
                      <td className="p-2">{r.program}</td>
                      <td className="p-2">{r.date}</td>
                      <td className="p-2">{r.internal_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 20 && (
                <p className="p-2 text-xs text-[var(--black)]/70">
                  … y {rows.length - 20} filas más
                </p>
              )}
            </div>
            <Button
              variant="primary"
              onClick={handleBulkIssue}
              disabled={loading}
            >
              {loading ? "Emitiendo…" : `Emitir ${rows.length} certificados`}
            </Button>
          </Card>
        )}

        {results && (
          <Card className="w-full space-y-4">
            <h2 className="text-base font-[var(--font-pixel)]">Resultados</h2>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((r, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center gap-2 p-2 bg-[var(--beige)] border border-[var(--black)]"
                >
                  {r.error ? (
                    <span className="text-red-600 text-sm">
                      {r.subject_name}: {r.error}
                    </span>
                  ) : (
                    <>
                      <span className="font-medium">{r.subject_name}</span>
                      <a
                        href={r.verify_url}
                        className="text-sm underline"
                      >
                        Verificar
                      </a>
                      {r.profile_url && (
                        <a
                          href={r.profile_url}
                          className="text-sm underline"
                        >
                          Perfil
                        </a>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </main>
    </div>
  );
}
