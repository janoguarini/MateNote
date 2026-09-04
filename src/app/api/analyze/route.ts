import { NextResponse } from "next/server";
import { z } from "zod";
import { extractYoutubeVideoId } from "@/lib/youtube/url";
import { YoutubeError } from "@/lib/youtube/errors";
import { getYoutubeVideo } from "@/lib/youtube/metadata";
import { getTranscript } from "@/lib/transcript";
import { analyzeTranscript } from "@/lib/ai/analyze";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAnalysisByVideoId, createAnalysis, saveAnalysisForUser } from "@/lib/db/analyses";
import { friendlyErrorResponse } from "@/lib/api-errors";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({ url: z.string().min(1) });

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`analyze:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Estás yendo un poco rápido",
        message: "Esperá unos minutos antes de analizar otro video.",
      },
      { status: 429 }
    );
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Solicitud inválida", message: "Se requiere una URL de YouTube." },
      { status: 400 }
    );
  }

  const videoId = extractYoutubeVideoId(body.url);
  if (!videoId) {
    return friendlyErrorResponse(new YoutubeError("invalid_url", "Invalid YouTube URL"));
  }

  try {
    let userId: string | null = null;
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;

      const existing = await getAnalysisByVideoId(supabase, videoId);
      if (existing) {
        if (userId) {
          const admin = createAdminClient();
          await saveAnalysisForUser(admin, userId, existing.id);
        }
        return NextResponse.json({ id: existing.id, cached: true });
      }
    }

    const video = await getYoutubeVideo(videoId);
    const transcript = await getTranscript(videoId);
    const result = await analyzeTranscript(video, transcript);

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error: "La base de datos todavía no está configurada",
          message:
            "El análisis se completó pero no se pudo guardar porque Supabase no está configurado. Agregá las variables de entorno de Supabase para persistir los análisis.",
        },
        { status: 503 }
      );
    }

    const admin = createAdminClient();
    const row = await createAnalysis(admin, video, transcript, result, userId);
    if (userId) {
      await saveAnalysisForUser(admin, userId, row.id);
    }

    return NextResponse.json({ id: row.id, cached: false });
  } catch (err) {
    return friendlyErrorResponse(err);
  }
}
