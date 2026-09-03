import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAnalysisById, isAnalysisSaved } from "@/lib/db/analyses";
import { AnalysisHeader } from "@/components/analysis/analysis-header";
import { AnalysisTabs } from "@/components/analysis/analysis-tabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isSupabaseConfigured()) return { title: "Analysis not found" };
  const { id } = await params;
  const supabase = await createClient();
  const analysis = await getAnalysisById(supabase, id).catch(() => null);
  if (!analysis) return { title: "Analysis not found" };
  return {
    title: analysis.title,
    description: analysis.summary,
    openGraph: { images: [analysis.thumbnail_url] },
  };
}

export default async function AnalysisPage({ params }: PageProps) {
  if (!isSupabaseConfigured()) notFound();

  const { id } = await params;
  const supabase = await createClient();

  const analysis = await getAnalysisById(supabase, id).catch(() => null);
  if (!analysis) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const saved = user ? await isAnalysisSaved(supabase, user.id, analysis.id) : false;

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-6 sm:px-8">
      <AnalysisHeader analysis={analysis} isSaved={saved} isAuthenticated={Boolean(user)} />
      <div className="mt-8">
        <AnalysisTabs analysis={analysis} />
      </div>
    </div>
  );
}
