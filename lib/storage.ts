import { readFile, writeFile, access } from "fs/promises";
import path from "path";

export type RecordItem = {
  hash: string;
  payload: any;
  created_at: string;
  anchored: boolean;
  tx_id: string | null;
  stellar_url: string | null;
};

const STORE_PATH = path.join(process.cwd(), "data", "records.json");

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function parseRecords(raw: string): Promise<RecordItem[]> {
  let arr: unknown;
  try {
    arr = JSON.parse(raw);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`El archivo records.json está corrupto o no es JSON válido: ${msg}`);
  }
  if (!Array.isArray(arr)) {
    throw new Error("records.json debe contener un array JSON.");
  }
  return arr as RecordItem[];
}

export async function ensureStore(): Promise<void> {
  const dir = path.dirname(STORE_PATH);
  const exists = await fileExists(STORE_PATH);
  if (!exists) {
    const { mkdir } = await import("fs/promises");
    await mkdir(dir, { recursive: true });
    await writeFile(STORE_PATH, "[]", "utf8");
  }
}

export async function getAllRecords(): Promise<RecordItem[]> {
  await ensureStore();
  const raw = await readFile(STORE_PATH, "utf8");
  return parseRecords(raw);
}

export async function findRecordByHash(hash: string): Promise<RecordItem | null> {
  const records = await getAllRecords();
  return records.find((r) => r.hash === hash) ?? null;
}

export async function saveRecord(record: RecordItem): Promise<void> {
  await ensureStore();
  const raw = await readFile(STORE_PATH, "utf8");
  const arr = await parseRecords(raw);
  arr.push(record);
  await writeFile(STORE_PATH, JSON.stringify(arr, null, 2), "utf8");
}
