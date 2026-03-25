export type TextSize = "small" | "medium" | "large" | "xlarge";
export type Theme = "light" | "dark" | "high-contrast";
export type Lens = "historical" | "protestant" | "catholic" | "orthodox" | "jewish" | "islamic" | "secular";
export type ContentType = "era" | "event" | "figure" | "topic" | "lens_view";
export type BookmarkType = "verse" | "timeline" | "library";

export interface Profile {
  id: string;
  display_name: string | null;
  text_size_preference: TextSize;
  theme_preference: Theme;
  default_lens: Lens | null;
  created_at: string;
  updated_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse: number | null;
  translation: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  type: BookmarkType;
  reference: Record<string, unknown>;
  label: string | null;
  auto_saved: boolean;
  created_at: string;
}

export interface ContentCache {
  id: string;
  content_type: ContentType;
  content_key: string;
  content: Record<string, unknown>;
  generated_at: string;
  last_accessed_at: string;
  access_count: number;
  flagged_for_review: boolean;
}

export interface Embedding {
  id: string;
  content_type: string;
  content_key: string;
  chunk_index: number;
  text_content: string;
  embedding: number[];
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string | null;
  stripe_payment_id: string;
  amount_cents: number;
  currency: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      reading_progress: {
        Row: ReadingProgress;
        Insert: Omit<ReadingProgress, "id" | "updated_at">;
        Update: Partial<Omit<ReadingProgress, "id" | "user_id">>;
      };
      bookmarks: {
        Row: Bookmark;
        Insert: Omit<Bookmark, "id" | "created_at">;
        Update: Partial<Omit<Bookmark, "id" | "user_id">>;
      };
      content_cache: {
        Row: ContentCache;
        Insert: Omit<ContentCache, "id" | "generated_at" | "last_accessed_at" | "access_count">;
        Update: Partial<Omit<ContentCache, "id">>;
      };
      embeddings: {
        Row: Embedding;
        Insert: Omit<Embedding, "id" | "created_at">;
        Update: never;
      };
      donations: {
        Row: Donation;
        Insert: Omit<Donation, "id" | "created_at">;
        Update: never;
      };
    };
  };
}
