import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listSavedAnalyses } from "@/lib/db/analyses";
import { rowToAnalysisResult } from "@/lib/db/types";
import { findCrossVideoPatterns } from "@/lib/ai/patterns";
import { friendlyErrorResponse } from "@/lib/api-errors";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`patterns:${user.id ?? ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const saved = await listSavedAnalyses(supabase, user.id);
    if (saved.length < 2) {
      return NextResponse.json(
        {
          error: "Not enough analyses yet",
          message: "Analyze at least 2 videos to detect patterns across your research.",
        },
        { status: 422 }
      );
    }

    const subset = saved.slice(0, 8);
    const patterns = await findCrossVideoPatterns(
      subset.map((row) => ({
        title: row.title,
        channel: row.channel,
        durationSeconds: row.duration_seconds,
        analysis: rowToAnalysisResult(row),
      }))
    );

    return NextResponse.json({ patterns, videoCount: subset.length });
  } catch (err) {
    return friendlyErrorResponse(err);
  }
}
