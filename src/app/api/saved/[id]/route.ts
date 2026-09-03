import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { unsaveAnalysisForUser } from "@/lib/db/analyses";
import { friendlyErrorResponse } from "@/lib/api-errors";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await unsaveAnalysisForUser(supabase, user.id, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return friendlyErrorResponse(err);
  }
}
