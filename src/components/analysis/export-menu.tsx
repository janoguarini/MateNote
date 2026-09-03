"use client";

import { Download, Copy, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { AnalysisRow } from "@/lib/db/types";
import { downloadTextFile } from "@/lib/export";
import { track } from "@/lib/analytics";

export function ExportMenu({ analysis }: { analysis: AnalysisRow }) {
  const { toast } = useToast();

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied`, variant: "success" });
  }

  function buildMarkdown(): string {
    return `# ${analysis.title}

**Channel:** ${analysis.channel}
**URL:** ${analysis.video_url}

## Summary

${analysis.summary}

## Key Takeaways

${analysis.key_takeaways.map((t) => `- ${t}`).join("\n")}

## Hook

**Type:** ${analysis.hook.type}
**Text:** "${analysis.hook.text}"
**Why it works:** ${analysis.hook.whyItWorks}
**Strength:** ${analysis.hook.strength}/10
**Formula:** ${analysis.hook.formula}

## Structure

${analysis.structure.map((s) => `- **${s.timestamp}** — ${s.title}: ${s.description}`).join("\n")}

## Key Moments

${analysis.key_moments.map((m) => `- **${m.timestamp}** — ${m.title}: ${m.description}`).join("\n")}

## Content Ideas

${analysis.content_ideas
  .map(
    (idea) =>
      `### ${idea.title}\n- **Hook:** ${idea.hook}\n- **Format:** ${idea.format}\n- **Angle:** ${idea.angle}\n- ${idea.explanation}`
  )
  .join("\n\n")}

## Creator Takeaways

${analysis.creator_takeaways.map((t) => `- ${t}`).join("\n")}

## Transcript

${analysis.transcript.fullText}
`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="size-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => copy(analysis.summary, "Summary")}>
          <Copy className="size-4" />
          Copy summary
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            copy(analysis.transcript.fullText, "Transcript");
            track({ name: "transcript_copied", analysisId: analysis.id });
          }}
        >
          <Copy className="size-4" />
          Copy transcript
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            downloadTextFile(`${slugify(analysis.title)}-transcript.txt`, analysis.transcript.fullText)
          }
        >
          <FileText className="size-4" />
          Download transcript (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => downloadTextFile(`${slugify(analysis.title)}-analysis.md`, buildMarkdown())}
        >
          <FileText className="size-4" />
          Download analysis (.md)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
