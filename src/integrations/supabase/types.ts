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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          duration_seconds: number
          id: string
          language: Database["public"]["Enums"]["app_language"]
          messages: Json
          mood: Database["public"]["Enums"]["app_mood"]
          student_id: string
          title: string
          topic_slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          id?: string
          language: Database["public"]["Enums"]["app_language"]
          messages?: Json
          mood?: Database["public"]["Enums"]["app_mood"]
          student_id: string
          title: string
          topic_slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          id?: string
          language?: Database["public"]["Enums"]["app_language"]
          messages?: Json
          mood?: Database["public"]["Enums"]["app_mood"]
          student_id?: string
          title?: string
          topic_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          difficulty: string | null
          email: string | null
          full_name: string | null
          id: string
          interest: string | null
          language: Database["public"]["Enums"]["app_language"]
          level: Database["public"]["Enums"]["app_level"]
          onboarding_completed: boolean
          practice_style: string | null
          preferred_mood: Database["public"]["Enums"]["app_mood"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          difficulty?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          interest?: string | null
          language?: Database["public"]["Enums"]["app_language"]
          level?: Database["public"]["Enums"]["app_level"]
          onboarding_completed?: boolean
          practice_style?: string | null
          preferred_mood?: Database["public"]["Enums"]["app_mood"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          difficulty?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          interest?: string | null
          language?: Database["public"]["Enums"]["app_language"]
          level?: Database["public"]["Enums"]["app_level"]
          onboarding_completed?: boolean
          practice_style?: string | null
          preferred_mood?: Database["public"]["Enums"]["app_mood"]
          updated_at?: string
        }
        Relationships: []
      }
      progress_snapshots: {
        Row: {
          conversational_flow: number
          created_at: string
          cultural_fluency: number
          date: string
          id: string
          pronunciation_clarity: number
          speaking_confidence: number
          student_id: string
        }
        Insert: {
          conversational_flow?: number
          created_at?: string
          cultural_fluency?: number
          date?: string
          id?: string
          pronunciation_clarity?: number
          speaking_confidence?: number
          student_id: string
        }
        Update: {
          conversational_flow?: number
          created_at?: string
          cultural_fluency?: number
          date?: string
          id?: string
          pronunciation_clarity?: number
          speaking_confidence?: number
          student_id?: string
        }
        Relationships: []
      }
      saved_expressions: {
        Row: {
          context: string | null
          created_at: string
          expression: string
          id: string
          student_id: string
          translation: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string
          expression: string
          id?: string
          student_id: string
          translation?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string
          expression?: string
          id?: string
          student_id?: string
          translation?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_language: "pt" | "en"
      app_level: "beginner" | "intermediate" | "advanced"
      app_mood: "calm" | "intensive" | "cultural" | "confidence"
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
      app_language: ["pt", "en"],
      app_level: ["beginner", "intermediate", "advanced"],
      app_mood: ["calm", "intensive", "cultural", "confidence"],
    },
  },
} as const
