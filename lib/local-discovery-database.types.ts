export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * App-facing Supabase schema contract for DallasCircle's local-discovery tables.
 * Legacy tables are intentionally excluded so new application code cannot query
 * retired service/merchant structures by accident. Regenerate after the legacy
 * database tables are removed in the coordinated cutover.
 */
export type LocalDiscoveryDatabase = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      place_slug_history: {
        Row: {
          created_at: string
          old_slug: string
          place_id: string
        }
        Insert: {
          created_at?: string
          old_slug: string
          place_id: string
        }
        Update: {
          created_at?: string
          old_slug?: string
          place_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_slug_history_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      place_categories: {
        Row: {
          category_id: string
          created_at: string
          is_primary: boolean
          place_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          is_primary?: boolean
          place_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          is_primary?: boolean
          place_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "place_categories_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          city: string
          country: string
          created_at: string
          description: string | null
          id: string
          name: string
          publication_status: string
          region: string
          slug: string
          updated_at: string
        }
        Insert: {
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          publication_status?: string
          region?: string
          slug: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          publication_status?: string
          region?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string
          created_at: string
          id: string
          last_editorial_review_at: string | null
          latitude: number | null
          longitude: number | null
          name: string
          neighborhood_id: string | null
          phone: string | null
          postal_code: string | null
          price_level: number | null
          publication_status: string
          published_at: string | null
          region: string
          slug: string
          summary: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string
          created_at?: string
          id?: string
          last_editorial_review_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          neighborhood_id?: string | null
          phone?: string | null
          postal_code?: string | null
          price_level?: number | null
          publication_status?: string
          published_at?: string | null
          region?: string
          slug: string
          summary?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string
          created_at?: string
          id?: string
          last_editorial_review_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          neighborhood_id?: string | null
          phone?: string | null
          postal_code?: string | null
          price_level?: number | null
          publication_status?: string
          published_at?: string | null
          region?: string
          slug?: string
          summary?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          publication_status: string
          published_at: string | null
          reviewed_at: string | null
          slug: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          id?: string
          publication_status?: string
          published_at?: string | null
          reviewed_at?: string | null
          slug: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          publication_status?: string
          published_at?: string | null
          reviewed_at?: string | null
          slug?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      place_sources: {
        Row: {
          accessed_at: string
          created_at: string
          id: string
          internal_notes: string | null
          place_id: string
          publisher_name: string | null
          source_type: string
          source_url: string
        }
        Insert: {
          accessed_at?: string
          created_at?: string
          id?: string
          internal_notes?: string | null
          place_id: string
          publisher_name?: string | null
          source_type: string
          source_url: string
        }
        Update: {
          accessed_at?: string
          created_at?: string
          id?: string
          internal_notes?: string | null
          place_id?: string
          publisher_name?: string | null
          source_type?: string
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_sources_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      place_facts: {
        Row: {
          checked_at: string
          created_at: string
          fact_key: string
          fact_value: Json
          id: string
          internal_notes: string | null
          place_id: string
          review_due_at: string | null
          source_id: string
          updated_at: string
          verification_status: string
        }
        Insert: {
          checked_at?: string
          created_at?: string
          fact_key: string
          fact_value: Json
          id?: string
          internal_notes?: string | null
          place_id: string
          review_due_at?: string | null
          source_id: string
          updated_at?: string
          verification_status?: string
        }
        Update: {
          checked_at?: string
          created_at?: string
          fact_key?: string
          fact_value?: Json
          id?: string
          internal_notes?: string | null
          place_id?: string
          review_due_at?: string | null
          source_id?: string
          updated_at?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_facts_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "place_facts_source_matches_place_fkey"
            columns: ["source_id", "place_id"]
            isOneToOne: false
            referencedRelation: "place_sources"
            referencedColumns: ["id", "place_id"]
          },
        ]
      }
      guide_places: {
        Row: {
          created_at: string
          editorial_rationale: string
          guide_id: string
          is_sponsored: boolean
          place_id: string
          position: number
          sponsorship_disclosure: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          editorial_rationale: string
          guide_id: string
          is_sponsored?: boolean
          place_id: string
          position: number
          sponsorship_disclosure?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          editorial_rationale?: string
          guide_id?: string
          is_sponsored?: boolean
          place_id?: string
          position?: number
          sponsorship_disclosure?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_places_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_places_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_sources: {
        Row: {
          accessed_at: string
          created_at: string
          guide_id: string
          id: string
          internal_notes: string | null
          publisher_name: string | null
          source_type: string
          source_url: string
        }
        Insert: {
          accessed_at?: string
          created_at?: string
          guide_id: string
          id?: string
          internal_notes?: string | null
          publisher_name?: string | null
          source_type: string
          source_url: string
        }
        Update: {
          accessed_at?: string
          created_at?: string
          guide_id?: string
          id?: string
          internal_notes?: string | null
          publisher_name?: string | null
          source_type?: string
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_sources_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
