import { getSupabaseAdmin } from "./supabase-server";

export type RecordItem = {
  hash: string;
  payload: unknown;
  created_at: string;
  anchored: boolean;
  tx_id: string | null;
  stellar_url: string | null;
};

export async function saveRecord(record: RecordItem): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("credentials")
      .upsert(
        {
          hash: record.hash,
          payload: record.payload,
          created_at: record.created_at,
          anchored: record.anchored,
          tx_id: record.tx_id,
          stellar_url: record.stellar_url,
        },
        { onConflict: "hash" }
      );

    if (error) {
      throw new Error(`supabase_error: ${error.message}`);
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("supabase_error:")) {
      throw e;
    }
    throw new Error(`supabase_error: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function findRecordByHash(hash: string): Promise<RecordItem | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("credentials")
      .select("*")
      .eq("hash", hash)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`supabase_error: ${error.message}`);
    }

    if (!data) return null;

    return {
      hash: data.hash,
      payload: data.payload,
      created_at: data.created_at,
      anchored: data.anchored ?? false,
      tx_id: data.tx_id ?? null,
      stellar_url: data.stellar_url ?? null,
    };
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("supabase_error:")) {
      throw e;
    }
    throw new Error(`supabase_error: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function updateRecordByHash(
  hash: string,
  patch: Partial<Omit<RecordItem, "hash">>
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const updatePayload: Record<string, unknown> = {};
    if (patch.payload !== undefined) updatePayload.payload = patch.payload;
    if (patch.created_at !== undefined) updatePayload.created_at = patch.created_at;
    if (patch.anchored !== undefined) updatePayload.anchored = patch.anchored;
    if (patch.tx_id !== undefined) updatePayload.tx_id = patch.tx_id;
    if (patch.stellar_url !== undefined) updatePayload.stellar_url = patch.stellar_url;

    const { error } = await supabase
      .from("credentials")
      .update(updatePayload)
      .eq("hash", hash);

    if (error) {
      throw new Error(`supabase_error: ${error.message}`);
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("supabase_error:")) {
      throw e;
    }
    throw new Error(`supabase_error: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function getAllRecords(): Promise<RecordItem[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("credentials").select("*");

    if (error) {
      throw new Error(`supabase_error: ${error.message}`);
    }

    return (data ?? []).map((row) => ({
      hash: row.hash,
      payload: row.payload,
      created_at: row.created_at,
      anchored: row.anchored ?? false,
      tx_id: row.tx_id ?? null,
      stellar_url: row.stellar_url ?? null,
    }));
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("supabase_error:")) {
      throw e;
    }
    throw new Error(`supabase_error: ${e instanceof Error ? e.message : String(e)}`);
  }
}
