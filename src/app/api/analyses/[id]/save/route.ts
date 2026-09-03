import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveAnalysisForUser, getAnalysisById } from "@/lib/db/analyses";
import { friendlyErrorResponse } from "@/lib/api-errors";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const analysis = await getAnalysisById(supabase, id);
    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }
    await saveAnalysisForUser(supabase, user.id, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return friendlyErrorResponse(err);
  }
}
