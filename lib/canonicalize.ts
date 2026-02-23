export type IssueInput = {
  issuer_name: string;
  subject_name: string;
  program: string;
  date: string;
  internal_id?: string;
};

export type CanonicalPayload = {
  issuer_name: string;
  subject_name: string;
  program: string;
  date: string;
  internal_id: string;
};

function normalizeDate(dateStr: string): string {
  const trimmed = dateStr.trim();
  // Ya está en YYYY-MM-DD
  const isoMatch = trimmed.match(/^\d{4}-\d{2}-\d{2}$/);
  if (isoMatch) {
    const [y, m, d] = trimmed.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d) {
      return trimmed;
    }
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Fecha inválida: "${dateStr}". Use formato YYYY-MM-DD.`);
  }
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function canonicalizePayload(input: IssueInput): CanonicalPayload {
  if (typeof input.issuer_name !== "string") {
    throw new Error("issuer_name debe ser un string.");
  }
  if (typeof input.subject_name !== "string") {
    throw new Error("subject_name debe ser un string.");
  }
  if (typeof input.program !== "string") {
    throw new Error("program debe ser un string.");
  }
  if (typeof input.date !== "string") {
    throw new Error("date debe ser un string.");
  }

  const issuer_name = input.issuer_name.trim();
  const subject_name = input.subject_name.trim();
  const program = input.program.trim();
  const date = normalizeDate(input.date);
  const internal_id = input.internal_id != null ? String(input.internal_id).trim() : "";

  if (!issuer_name) {
    throw new Error("issuer_name no puede estar vacío.");
  }
  if (!subject_name) {
    throw new Error("subject_name no puede estar vacío.");
  }
  if (!program) {
    throw new Error("program no puede estar vacío.");
  }

  return {
    issuer_name,
    subject_name,
    program,
    date,
    internal_id,
  };
}
