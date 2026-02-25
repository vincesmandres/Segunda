import { NextResponse } from "next/server";
import { createClientWithCookies } from "@/lib/supabase/server";

async function handleLogout(request: Request) {
  const supabase = await createClientWithCookies();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), {
    status: 302,
  });
}

export async function GET(request: Request) {
  return handleLogout(request);
}

export async function POST(request: Request) {
  return handleLogout(request);
}
