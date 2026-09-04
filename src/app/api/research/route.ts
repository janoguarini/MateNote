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
    return NextResponse.json({ error: "No estás autenticado" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`research:${ip}`, 30, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  if (!isYoutubeDataApiConfigured()) {
    return NextResponse.json(
      {
        error: "La búsqueda de YouTube no está configurada",
        message: "Agregá una variable de entorno YOUTUBE_API_KEY para habilitar la investigación de creadores.",
        configured: false,
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Se requiere un término de búsqueda." }, { status: 400 });
  }

  try {
    const results = await searchYoutubeVideos(query);
    return NextResponse.json({ results, configured: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Falló la búsqueda", message: "Por favor, intentá de nuevo en un momento." },
      { status: 502 }
    );
  }
}
