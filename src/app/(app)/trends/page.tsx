import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { listSavedAnalyses } from "@/lib/db/analyses";
import { TrendingGrid } from "@/components/app/trending-grid";
import { PatternFinder } from "@/components/app/pattern-finder";

export const metadata: Metadata = { title: "Tendencias" };

export default async function TrendsPage() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const saved = user ? await listSavedAnalyses(supabase, user.id) : [];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Tendencias</h1>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Lo que está en tendencia en YouTube ahora mismo, y qué tiene en común tu propia
          investigación.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Tendencias ahora</h2>
        <TrendingGrid />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Patrones de tu investigación</h2>
        <PatternFinder savedCount={saved.length} />
      </div>
    </div>
  );
}
