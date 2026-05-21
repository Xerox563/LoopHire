import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { table, action, data, query } = await req.json();

    if (!table || !action) {
      return NextResponse.json({ error: "Missing table or action" }, { status: 400 });
    }

    let result;
    let error;

    switch (action) {
      case "insert":
        ({ data: result, error } = await supabase.from(table).insert(data).select());
        break;
      case "update":
        ({ data: result, error } = await supabase.from(table).update(data).match(query).select());
        break;
      case "delete":
        ({ data: result, error } = await supabase.from(table).delete().match(query).select());
        break;
      case "upsert":
        ({ data: result, error } = await supabase.from(table).upsert(data).select());
        break;
      case "select":
        ({ data: result, error } = await supabase.from(table).select(data).match(query));
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (error) {
      console.error(`DB ${action} error on ${table}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("DB route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
