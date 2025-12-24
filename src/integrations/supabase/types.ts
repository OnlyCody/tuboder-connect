export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      board_members: {
        Row: {
          bio_bs: string | null
          bio_en: string | null
          bio_tr: string | null
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          name_bs: string
          name_en: string
          name_tr: string
          photo_url: string | null
          position_bs: string
          position_en: string
          position_tr: string
          updated_at: string
        }
        Insert: {
          bio_bs?: string | null
          bio_en?: string | null
          bio_tr?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name_bs: string
          name_en: string
          name_tr: string
          photo_url?: string | null
          position_bs: string
          position_en: string
          position_tr: string
          updated_at?: string
        }
        Update: {
          bio_bs?: string | null
          bio_en?: string | null
          bio_tr?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name_bs?: string
          name_en?: string
          name_tr?: string
          photo_url?: string | null
          position_bs?: string
          position_en?: string
          position_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      bosnia_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          title_bs: string
          title_en: string
          title_tr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          title_bs: string
          title_en: string
          title_tr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          title_bs?: string
          title_en?: string
          title_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_categories: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_bs: string
          name_en: string
          name_tr: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_bs: string
          name_en: string
          name_tr: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_bs?: string
          name_en?: string
          name_tr?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      carousel_items: {
        Row: {
          created_at: string
          description_bs: string
          description_en: string
          description_tr: string
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          title_bs: string
          title_en: string
          title_tr: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_bs: string
          description_en: string
          description_tr: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title_bs: string
          title_en: string
          title_tr: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_bs?: string
          description_en?: string
          description_tr?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title_bs?: string
          title_en?: string
          title_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          content_bs: string | null
          content_en: string | null
          content_tr: string | null
          created_at: string
          description_bs: string
          description_en: string
          description_tr: string
          event_date: string
          id: string
          image_url: string | null
          instagram_url: string | null
          is_published: boolean | null
          location_bs: string | null
          location_en: string | null
          location_tr: string | null
          title_bs: string
          title_en: string
          title_tr: string
          updated_at: string
        }
        Insert: {
          content_bs?: string | null
          content_en?: string | null
          content_tr?: string | null
          created_at?: string
          description_bs: string
          description_en: string
          description_tr: string
          event_date: string
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_published?: boolean | null
          location_bs?: string | null
          location_en?: string | null
          location_tr?: string | null
          title_bs: string
          title_en: string
          title_tr: string
          updated_at?: string
        }
        Update: {
          content_bs?: string | null
          content_en?: string | null
          content_tr?: string | null
          created_at?: string
          description_bs?: string
          description_en?: string
          description_tr?: string
          event_date?: string
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_published?: boolean | null
          location_bs?: string | null
          location_en?: string | null
          location_tr?: string | null
          title_bs?: string
          title_en?: string
          title_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          album_bs: string | null
          album_en: string | null
          album_tr: string | null
          created_at: string
          description_bs: string | null
          description_en: string | null
          description_tr: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          title_bs: string
          title_en: string
          title_tr: string
          updated_at: string
        }
        Insert: {
          album_bs?: string | null
          album_en?: string | null
          album_tr?: string | null
          created_at?: string
          description_bs?: string | null
          description_en?: string | null
          description_tr?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          title_bs: string
          title_en: string
          title_tr: string
          updated_at?: string
        }
        Update: {
          album_bs?: string | null
          album_en?: string | null
          album_tr?: string | null
          created_at?: string
          description_bs?: string | null
          description_en?: string | null
          description_tr?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          title_bs?: string
          title_en?: string
          title_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_businesses: {
        Row: {
          address: string | null
          business_name: string
          category_id: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          owner_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_name: string
          category_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          owner_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_name?: string
          category_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          owner_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          content_bs: string | null
          content_en: string | null
          content_tr: string | null
          created_at: string
          description_bs: string
          description_en: string
          description_tr: string
          id: string
          image_url: string | null
          is_published: boolean | null
          published_date: string
          title_bs: string
          title_en: string
          title_tr: string
          updated_at: string
        }
        Insert: {
          content_bs?: string | null
          content_en?: string | null
          content_tr?: string | null
          created_at?: string
          description_bs: string
          description_en: string
          description_tr: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_date?: string
          title_bs: string
          title_en: string
          title_tr: string
          updated_at?: string
        }
        Update: {
          content_bs?: string | null
          content_en?: string | null
          content_tr?: string | null
          created_at?: string
          description_bs?: string
          description_en?: string
          description_tr?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_date?: string
          title_bs?: string
          title_en?: string
          title_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
