export type AnalyticsEvent =
  | { name: "landing_view" }
  | { name: "analyze_started"; url: string }
  | { name: "analyze_completed"; videoId: string; cached: boolean }
  | { name: "analysis_saved"; analysisId: string }
  | { name: "transcript_copied"; analysisId: string }
  | { name: "content_idea_generated"; analysisId: string; count: number };

/**
 * Minimal analytics seam. Swap the body of this function for a real
 * provider (PostHog, Plausible, Segment, ...) without touching call sites —
 * every event this product needs is already typed and wired up below.
 */
export function track(event: AnalyticsEvent) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event.name, event);
  }
}
