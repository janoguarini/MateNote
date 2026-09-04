import { NextResponse } from "next/server";
import { getTrendingVideos, isYoutubeDataApiConfigured } from "@/lib/youtube/search";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
  }

  if (!isYoutubeDataApiConfigured()) {
    return NextResponse.json(
      {
        error: "Las tendencias no están configuradas",
        message: "Agregá una variable de entorno YOUTUBE_API_KEY para ver datos reales de tendencias.",
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
      { error: "Falló la solicitud de tendencias", message: "Por favor, intentá de nuevo en un momento." },
      { status: 502 }
    );
  }
}
