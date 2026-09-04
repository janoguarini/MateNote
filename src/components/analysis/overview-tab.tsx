import { CheckCircle2, Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisRow } from "@/lib/db/types";

export function OverviewTab({ analysis }: { analysis: AnalysisRow }) {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen con IA</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-foreground/90">{analysis.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Puntos clave</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {analysis.key_takeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Qué robarle al creador</CardTitle>
          <p className="text-sm text-muted-foreground">¿Qué debería robarle a este video?</p>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {analysis.creator_takeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <Gem className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
