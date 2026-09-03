import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { listSavedAnalyses } from "@/lib/db/analyses";
import { SavedList } from "@/components/app/saved-list";

export const metadata: Metadata = { title: "Saved" };

export default async function SavedPage() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const items = user ? await listSavedAnalyses(supabase, user.id) : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Saved</h1>
        <p className="mt-1 text-muted-foreground">Your personal research library.</p>
      </div>
      <SavedList
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
          channel: item.channel,
          thumbnail_url: item.thumbnail_url,
          duration_seconds: item.duration_seconds,
          saved_at: item.saved_at,
        }))}
      />
    </div>
  );
}
