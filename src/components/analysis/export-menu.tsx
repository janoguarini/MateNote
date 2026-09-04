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
    toast({ title: `${label} copiado`, variant: "success" });
  }

  function buildMarkdown(): string {
    return `# ${analysis.title}

**Canal:** ${analysis.channel}
**URL:** ${analysis.video_url}

## Resumen

${analysis.summary}

## Puntos clave

${analysis.key_takeaways.map((t) => `- ${t}`).join("\n")}

## Hook

**Tipo:** ${analysis.hook.type}
**Texto:** "${analysis.hook.text}"
**Por qué funciona:** ${analysis.hook.whyItWorks}
**Fuerza:** ${analysis.hook.strength}/10
**Fórmula:** ${analysis.hook.formula}

## Estructura

${analysis.structure.map((s) => `- **${s.timestamp}** — ${s.title}: ${s.description}`).join("\n")}

## Momentos clave

${analysis.key_moments.map((m) => `- **${m.timestamp}** — ${m.title}: ${m.description}`).join("\n")}

## Ideas de contenido

${analysis.content_ideas
  .map(
    (idea) =>
      `### ${idea.title}\n- **Hook:** ${idea.hook}\n- **Formato:** ${idea.format}\n- **Ángulo:** ${idea.angle}\n- ${idea.explanation}`
  )
  .join("\n\n")}

## Qué robarle al creador

${analysis.creator_takeaways.map((t) => `- ${t}`).join("\n")}

## Transcripción

${analysis.transcript.fullText}
`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="size-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => copy(analysis.summary, "Resumen")}>
          <Copy className="size-4" />
          Copiar resumen
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            copy(analysis.transcript.fullText, "Transcripción");
            track({ name: "transcript_copied", analysisId: analysis.id });
          }}
        >
          <Copy className="size-4" />
          Copiar transcripción
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            downloadTextFile(`${slugify(analysis.title)}-transcripcion.txt`, analysis.transcript.fullText)
          }
        >
          <FileText className="size-4" />
          Descargar transcripción (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => downloadTextFile(`${slugify(analysis.title)}-analisis.md`, buildMarkdown())}
        >
          <FileText className="size-4" />
          Descargar análisis (.md)
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
