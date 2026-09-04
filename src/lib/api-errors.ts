import { NextResponse } from "next/server";
import { YoutubeError } from "./youtube/errors";
import { AiAnalysisError } from "./ai/analyze";
import { MissingApiKeyError } from "./ai/client";

export interface FriendlyError {
  title: string;
  message: string;
  status: number;
}

/**
 * Maps internal errors to the calm, non-technical messages the product
 * spec requires — never a raw stack trace or provider error string.
 */
export function toFriendlyError(err: unknown): FriendlyError {
  if (err instanceof YoutubeError) {
    switch (err.code) {
      case "invalid_url":
        return {
          title: "Eso no parece un link de YouTube",
          message: "Pegá la URL completa de un video, Short, o link youtu.be de YouTube.",
          status: 400,
        };
      case "video_not_found":
        return {
          title: "No pudimos encontrar este video",
          message: "Puede haber sido eliminado, o es privado. Probá con otro video público de YouTube.",
          status: 404,
        };
      case "video_private":
        return {
          title: "Este video es privado",
          message: "MateNote solo puede analizar videos públicos de YouTube.",
          status: 403,
        };
      case "transcript_unavailable":
        return {
          title: "No pudimos analizar este video",
          message:
            "Este video no parece tener una transcripción accesible. Probá con otro video público de YouTube.",
          status: 422,
        };
      case "network_error":
        return {
          title: "YouTube no está disponible en este momento",
          message: "Por favor, intentá de nuevo en un momento.",
          status: 502,
        };
    }
  }

  if (err instanceof MissingApiKeyError) {
    return {
      title: "El análisis con IA todavía no está configurado",
      message: `${err.message} Agregala a tus variables de entorno para habilitar el análisis.`,
      status: 503,
    };
  }

  if (err instanceof AiAnalysisError) {
    return {
      title: "No pudimos generar insights para este video",
      message: "Algo salió mal al analizar la transcripción. Por favor, intentá de nuevo.",
      status: 502,
    };
  }

  return {
    title: "Algo salió mal",
    message: "Ocurrió un error inesperado. Por favor, intentá de nuevo.",
    status: 500,
  };
}

export function friendlyErrorResponse(err: unknown) {
  const friendly = toFriendlyError(err);
  console.error(err);
  return NextResponse.json(
    { error: friendly.title, message: friendly.message },
    { status: friendly.status }
  );
}
