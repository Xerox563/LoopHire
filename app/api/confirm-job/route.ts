import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { id, action } = await req.json();

    if (!id || !action) {
      return NextResponse.json({ error: "Missing ID or action" }, { status: 400 });
    }

    const status = action === "confirm" ? "confirmed" : "skipped";

    const { error } = await supabase
      .from("jobs")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error("Confirmation route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
