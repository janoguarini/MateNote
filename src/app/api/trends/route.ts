import { NextResponse } from "next/server";
import { getTrendingVideos, isYoutubeDataApiConfigured } from "@/lib/youtube/search";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!isYoutubeDataApiConfigured()) {
    return NextResponse.json(
      {
        error: "Trends aren't configured",
        message: "Add a YOUTUBE_API_KEY environment variable to see real trending data.",
        configured: false,
      },
      { status: 503 }
    );
  }

  try {
    const results = await getTrendingVideos();
    return NextResponse.json({ results, configured: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Trends request failed", message: "Please try again in a moment." },
      { status: 502 }
    );
  }
}
