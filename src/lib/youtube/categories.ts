/**
 * YouTube's standard video category taxonomy (stable IDs, documented at
 * developers.google.com/youtube/v3/docs/videoCategories/list). Hardcoded
 * in Spanish here instead of calling the videoCategories.list endpoint —
 * one fewer API call per video, and the taxonomy essentially never changes.
 */
const YOUTUBE_CATEGORIES: Record<string, string> = {
  "1": "Cine y animación",
  "2": "Autos y vehículos",
  "10": "Música",
  "15": "Mascotas y animales",
  "17": "Deportes",
  "18": "Cortometrajes",
  "19": "Viajes y eventos",
  "20": "Videojuegos",
  "21": "Videoblog",
  "22": "Personas y blogs",
  "23": "Comedia",
  "24": "Entretenimiento",
  "25": "Noticias y política",
  "26": "Tutoriales y estilo",
  "27": "Educación",
  "28": "Ciencia y tecnología",
  "29": "ONGs y activismo",
  "30": "Películas",
  "31": "Animación",
  "32": "Acción y aventura",
  "33": "Clásicos",
  "34": "Comedia",
  "35": "Documental",
  "36": "Drama",
  "37": "Familiar",
  "38": "Extranjero",
  "39": "Terror",
  "40": "Ciencia ficción y fantasía",
  "41": "Suspenso",
  "42": "Shorts",
  "43": "Programas",
  "44": "Trailers",
};

export function getCategoryName(categoryId: string | null | undefined): string | null {
  if (!categoryId) return null;
  return YOUTUBE_CATEGORIES[categoryId] ?? null;
}
