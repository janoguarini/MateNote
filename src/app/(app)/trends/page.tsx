import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { listSavedAnalyses } from "@/lib/db/analyses";
import { TrendingGrid } from "@/components/app/trending-grid";
import { PatternFinder } from "@/components/app/pattern-finder";

export const metadata: Metadata = { title: "Trends" };

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
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Trends</h1>
        <p className="mt-2 max-w-lg text-muted-foreground">
          What&apos;s trending on YouTube right now, and what your own research has in common.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Trending now</h2>
        <TrendingGrid />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Your research patterns</h2>
        <PatternFinder savedCount={saved.length} />
      </div>
    </div>
  );
}
