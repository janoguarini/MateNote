import type {
  AnalysisResult,
  ContentIdea,
  Hook,
  KeyMoment,
  StructureBeat,
} from "../ai/schema";
import type { Transcript } from "../transcript";

export type AnalysisRow = {
  id: string;
  video_id: string;
  video_url: string;
  title: string;
  channel: string;
  thumbnail_url: string;
  duration_seconds: number | null;
  published_at: string | null;
  view_count: number | null;
  like_count: number | null;
  comment_count: number | null;
  tags: string[] | null;
  category: string | null;
  channel_id: string | null;
  subscriber_count: number | null;
  transcript: Transcript;
  summary: string;
  key_takeaways: string[];
  hook: Hook;
  structure: StructureBeat[];
  key_moments: KeyMoment[];
  content_ideas: ContentIdea[];
  creator_takeaways: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type SavedItemRow = {
  id: string;
  user_id: string;
  analysis_id: string;
  created_at: string;
};

export type AnalysisInsert = {
  id?: string;
  video_id: string;
  video_url: string;
  title: string;
  channel: string;
  thumbnail_url: string;
  duration_seconds: number | null;
  published_at?: string | null;
  view_count?: number | null;
  like_count?: number | null;
  comment_count?: number | null;
  tags?: string[] | null;
  category?: string | null;
  channel_id?: string | null;
  subscriber_count?: number | null;
  transcript: Transcript;
  summary: string;
  key_takeaways: string[];
  hook: Hook;
  structure: StructureBeat[];
  key_moments: KeyMoment[];
  content_ideas: ContentIdea[];
  creator_takeaways: string[];
  created_by: string | null;
  created_at?: string;
  updated_at?: string;
};

export type SavedItemInsert = {
  id?: string;
  user_id: string;
  analysis_id: string;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      analyses: {
        Row: AnalysisRow;
        Insert: AnalysisInsert;
        Update: Partial<AnalysisRow>;
        Relationships: [];
      };
      saved_items: {
        Row: SavedItemRow;
        Insert: SavedItemInsert;
        Update: Partial<SavedItemRow>;
        Relationships: [
          {
            foreignKeyName: "saved_items_analysis_id_fkey";
            columns: ["analysis_id"];
            isOneToOne: false;
            referencedRelation: "analyses";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export function rowToAnalysisResult(row: AnalysisRow): AnalysisResult {
  return {
    summary: row.summary,
    keyTakeaways: row.key_takeaways,
    hook: row.hook,
    structure: row.structure,
    keyMoments: row.key_moments,
    contentIdeas: row.content_ideas,
    creatorTakeaways: row.creator_takeaways,
  };
}
