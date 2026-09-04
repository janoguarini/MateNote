"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./overview-tab";
import { HookTab } from "./hook-tab";
import { StructureTab } from "./structure-tab";
import { IdeasTab } from "./ideas-tab";
import { TranscriptTab } from "./transcript-tab";
import type { AnalysisRow } from "@/lib/db/types";

export function AnalysisTabs({ analysis }: { analysis: AnalysisRow }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="hook">Hook</TabsTrigger>
        <TabsTrigger value="structure">Estructura</TabsTrigger>
        <TabsTrigger value="ideas">Ideas</TabsTrigger>
        <TabsTrigger value="transcript">Transcripción</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab analysis={analysis} />
      </TabsContent>
      <TabsContent value="hook">
        <HookTab analysis={analysis} />
      </TabsContent>
      <TabsContent value="structure">
        <StructureTab analysis={analysis} />
      </TabsContent>
      <TabsContent value="ideas">
        <IdeasTab analysis={analysis} />
      </TabsContent>
      <TabsContent value="transcript">
        <TranscriptTab analysis={analysis} />
      </TabsContent>
    </Tabs>
  );
}
