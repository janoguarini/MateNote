import { NextResponse } from "next/server";
import { searchYoutubeVideos, isYoutubeDataApiConfigured } from "@/lib/youtube/search";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`research:${ip}`, 30, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isYoutubeDataApiConfigured()) {
    return NextResponse.json(
      {
        error: "YouTube search isn't configured",
        message: "Add a YOUTUBE_API_KEY environment variable to enable creator research.",
        configured: false,
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "A search query is required." }, { status: 400 });
  }

  try {
    const results = await searchYoutubeVideos(query);
    return NextResponse.json({ results, configured: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Search failed", message: "Please try again in a moment." },
      { status: 502 }
    );
  }
}
