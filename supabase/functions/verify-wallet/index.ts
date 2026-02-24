const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  }

  try {
    const body = await req.json() as {
      wallet?: string;
      message?: string;
      signature?: string;
    };

    const wallet = body?.wallet;
    const message = body?.message;
    const signature = body?.signature;

    if (!wallet || !message || !signature) {
      const missing: string[] = [];
      if (!wallet) missing.push("wallet");
      if (!message) missing.push("message");
      if (!signature) missing.push("signature");

      return new Response(
        JSON.stringify({ error: "Missing required fields", missing }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
