import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function AnalysisNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <div className="flex size-12 items-center justify-center rounded-full bg-accent">
        <SearchX className="size-5 text-accent-foreground" />
      </div>
      <h1 className="mt-5 text-xl font-semibold">We couldn&apos;t find this analysis</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        It may have been removed, or the link is incorrect.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Analyze a video</Link>
      </Button>
    </div>
  );
}
