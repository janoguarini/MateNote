import { z } from "zod";

export const HOOK_TYPES = [
  "Curiosidad",
  "Contraria",
  "Problema",
  "Historia",
  "Promesa",
  "Impacto",
  "Pregunta",
] as const;

export const hookSchema = z.object({
  text: z
    .string()
    .describe(
      "The hook's opening line(s), translated/paraphrased into natural Spanish. Never in the video's original language or script — always Spanish."
    ),
  type: z.enum(HOOK_TYPES),
  whyItWorks: z.string().describe("2-3 sentence explanation of why this hook is effective"),
  strength: z.number().min(1).max(10).describe("Estimated hook strength, 1-10"),
  formula: z
    .string()
    .describe('Abstract pattern, e.g. "Unexpected result + curiosity gap + promise"'),
});

export const structureBeatSchema = z.object({
  timestamp: z.string().describe("MM:SS or HH:MM:SS timestamp"),
  title: z.string(),
  description: z.string(),
});

export const keyMomentSchema = z.object({
  timestamp: z.string().describe("MM:SS or HH:MM:SS timestamp"),
  title: z.string(),
  description: z.string(),
});

export const contentIdeaSchema = z.object({
  title: z.string().describe("A scroll-stopping title for the derived content idea"),
  hook: z.string().describe("An opening line for this new piece of content"),
  format: z.string().describe('e.g. "Short-form video", "Long-form video", "Carousel", "Thread"'),
  angle: z.string().describe("The unique angle or perspective this idea takes"),
  explanation: z.string().describe("Why this idea could work, 1-2 sentences"),
});

export const analysisResultSchema = z.object({
  summary: z.string().describe("A clear, useful 3-5 sentence summary of the entire video"),
  keyTakeaways: z.array(z.string()).min(5).max(10),
  hook: hookSchema,
  structure: z.array(structureBeatSchema).min(3).max(12),
  keyMoments: z.array(keyMomentSchema).min(2).max(8),
  contentIdeas: z.array(contentIdeaSchema).min(5).max(10),
  creatorTakeaways: z
    .array(z.string())
    .min(4)
    .max(10)
    .describe("Reusable principles: storytelling, hook, pacing, structure, framing, CTA, editing, topic selection"),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type Hook = z.infer<typeof hookSchema>;
export type StructureBeat = z.infer<typeof structureBeatSchema>;
export type KeyMoment = z.infer<typeof keyMomentSchema>;
export type ContentIdea = z.infer<typeof contentIdeaSchema>;

export const crossVideoPatternSchema = z.object({
  commonalities: z.array(
    z.object({
      label: z.string().describe('e.g. "Similar hooks", "Recurring phrases"'),
      description: z.string(),
    })
  ),
  contentOpportunity: z.string().describe("A concrete angle that's underused across these videos"),
});

export type CrossVideoPattern = z.infer<typeof crossVideoPatternSchema>;
