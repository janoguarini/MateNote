import Link from "next/link";
import {
  FileText,
  Sparkles,
  Zap,
  ListTree,
  Lightbulb,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";
import { TrackView } from "@/components/marketing/track-view";
import { AnalyzeForm } from "@/components/analyze/analyze-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: FileText,
    title: "Transcript",
    description: "Get the full video transcript in clean, timestamped text.",
  },
  {
    icon: Sparkles,
    title: "AI Summary",
    description: "Understand the entire video in seconds.",
  },
  {
    icon: Zap,
    title: "Hook Analysis",
    description: "See how the creator captures attention in the first seconds.",
  },
  {
    icon: ListTree,
    title: "Video Structure",
    description: "Understand how the video is organized, beat by beat.",
  },
  {
    icon: Lightbulb,
    title: "Content Ideas",
    description: "Generate new content ideas based on the video.",
  },
  {
    icon: TrendingUp,
    title: "Trend Research",
    description: "Discover patterns across creators and videos.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Paste",
    description: "Paste any YouTube URL — a full video, a Short, or a youtu.be link.",
  },
  {
    number: "02",
    title: "Analyze",
    description: "MateNote extracts the transcript and understands the content with AI.",
  },
  {
    number: "03",
    title: "Create",
    description: "Turn insights, hooks and structure into better content of your own.",
  },
];

const STUDY_POINTS = [
  "patterns",
  "hooks",
  "topics",
  "formats",
  "storytelling techniques",
  "content opportunities",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <TrackView event={{ name: "landing_view" }} />
      <MarketingNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-noise relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-24 h-[420px] bg-[radial-gradient(ellipse_at_top,var(--accent),transparent_65%)] opacity-70" />
          <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:px-8 sm:pt-28">
            <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              A research workspace for creators
            </div>
            <h1
              className="animate-fade-up font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl"
              style={{ animationDelay: "60ms" }}
            >
              Turn YouTube videos into
              <br />
              <span className="italic text-primary">creator insights.</span>
            </h1>
            <p
              className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
              style={{ animationDelay: "120ms" }}
            >
              Paste a YouTube video. Get the transcript, summary, hooks, structure and ideas
              worth stealing — in seconds.
            </p>

            <div
              className="animate-fade-up mx-auto mt-10 max-w-xl"
              style={{ animationDelay: "180ms" }}
            >
              <AnalyzeForm size="hero" />
              <p className="mt-3 text-xs text-muted-foreground">
                Analyze any public YouTube video
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mb-14 max-w-xl">
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">How it works</h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
              {STEPS.map((step) => (
                <div key={step.number}>
                  <span className="font-display text-3xl text-primary/50">{step.number}</span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border bg-secondary/40 py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mb-14 max-w-xl">
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                Everything in one workspace
              </h2>
              <p className="mt-3 text-muted-foreground">
                Not just a transcript tool — a full research layer for anyone making content.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  className="group p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent transition-colors">
                    <feature.icon className="size-5 text-accent-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Creator research */}
        <section id="research" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                  Stop watching.
                  <br />
                  <span className="italic text-primary">Start studying.</span>
                </h2>
                <p className="mt-4 max-w-md text-muted-foreground">
                  MateNote lets you study content that already works, so you can find the{" "}
                  {STUDY_POINTS.slice(0, -1).join(", ")}, and{" "}
                  {STUDY_POINTS[STUDY_POINTS.length - 1]} worth borrowing for your own videos.
                </p>
                <Button asChild className="mt-7">
                  <Link href="/signup">
                    Start researching
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STUDY_POINTS.map((point, i) => (
                  <Card
                    key={point}
                    className={cardTilt(i)}
                  >
                    <p className="text-sm font-medium capitalize">{point}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border bg-secondary/40 py-28">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Your next great idea might already be on YouTube.
            </h2>
            <Button asChild size="lg" className="mt-8">
              <Link href="/signup">
                Analyze your first video
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function cardTilt(i: number): string {
  const base = "p-5 flex items-center justify-center text-center min-h-[92px]";
  return i % 3 === 1 ? `${base} mt-4` : base;
}
