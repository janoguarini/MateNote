import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { listSavedAnalyses } from "@/lib/db/analyses";
import { AnalyzeForm } from "@/components/analyze/analyze-form";
import { AnalysisCard } from "@/components/app/analysis-card";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  // The (app) layout redirects unauthenticated/unconfigured requests, but
  // layouts and pages fetch in parallel in the App Router — guard here too
  // so this page never throws while that redirect is still in flight.
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const recent = user ? await listSavedAnalyses(supabase, user.id) : [];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-2xl">Good to see you 👋</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
          What do you want to research today?
        </h1>
        <div className="mt-6 max-w-2xl">
          <AnalyzeForm size="hero" />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent analyses</h2>
        {recent.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Your research library is empty."
            description="Analyze your first YouTube video and start building your knowledge base."
            ctaLabel="Analyze a video"
            ctaHref="/analyze"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.slice(0, 6).map((item) => (
              <AnalysisCard
                key={item.id}
                id={item.id}
                title={item.title}
                channel={item.channel}
                thumbnailUrl={item.thumbnail_url}
                durationSeconds={item.duration_seconds}
                date={item.saved_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
