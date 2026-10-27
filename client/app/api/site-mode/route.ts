import { NextResponse } from "next/server";
import { getSiteMode } from "@/utils/siteMode";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { mode: await getSiteMode() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
