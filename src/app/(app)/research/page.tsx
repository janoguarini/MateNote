import type { Metadata } from "next";
import { ResearchSearch } from "@/components/app/research-search";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Research what works.</h1>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Search creators, topics or video ideas, then analyze anything that catches your eye.
        </p>
      </div>
      <ResearchSearch />
    </div>
  );
}
