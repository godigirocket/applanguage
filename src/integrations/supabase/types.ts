export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string;
          duration_seconds: number;
          id: string;
          language: Database["public"]["Enums"]["app_language"];
          messages: Json;
          mood: Database["public"]["Enums"]["app_mood"];
          student_id: string;
          title: string;
          topic_slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          duration_seconds?: number;
          id?: string;
          language: Database["public"]["Enums"]["app_language"];
          messages?: Json;
          mood?: Database["public"]["Enums"]["app_mood"];
          student_id: string;
          title: string;
          topic_slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          duration_seconds?: number;
          id?: string;
          language?: Database["public"]["Enums"]["app_language"];
          messages?: Json;
          mood?: Database["public"]["Enums"]["app_mood"];
          student_id?: string;
          title?: string;
          topic_slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          difficulty: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          interest: string | null;
          language: Database["public"]["Enums"]["app_language"];
          level: Database["public"]["Enums"]["app_level"];
          onboarding_completed: boolean;
          onboarding_done: boolean;
          practice_style: string | null;
          preferred_mood: Database["public"]["Enums"]["app_mood"];
          updated_at: string;
          plan: string | null;
          xp: number;
          streak: number;
          premium_until: string | null;
          upgraded_at: string | null;
          cakto_customer_email: string | null;
          cakto_order_id: string | null;
          cakto_subscription_id: string | null;
          last_payment_status: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          difficulty?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          interest?: string | null;
          language?: Database["public"]["Enums"]["app_language"];
          level?: Database["public"]["Enums"]["app_level"];
          onboarding_completed?: boolean;
          onboarding_done?: boolean;
          practice_style?: string | null;
          preferred_mood?: Database["public"]["Enums"]["app_mood"];
          updated_at?: string;
          plan?: string | null;
          xp?: number;
          streak?: number;
          premium_until?: string | null;
          upgraded_at?: string | null;
          cakto_customer_email?: string | null;
          cakto_order_id?: string | null;
          cakto_subscription_id?: string | null;
          last_payment_status?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          difficulty?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          interest?: string | null;
          language?: Database["public"]["Enums"]["app_language"];
          level?: Database["public"]["Enums"]["app_level"];
          onboarding_completed?: boolean;
          onboarding_done?: boolean;
          practice_style?: string | null;
          preferred_mood?: Database["public"]["Enums"]["app_mood"];
          updated_at?: string;
          plan?: string | null;
          xp?: number;
          streak?: number;
          premium_until?: string | null;
          upgraded_at?: string | null;
          cakto_customer_email?: string | null;
          cakto_order_id?: string | null;
          cakto_subscription_id?: string | null;
          last_payment_status?: string | null;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: string;
          score: number | null;
          xp_earned: number;
          progress: number;
          current_step: number | null;
          total_steps: number | null;
          started_at: string | null;
          completed_at: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: string;
          score?: number | null;
          xp_earned?: number;
          progress?: number;
          current_step?: number | null;
          total_steps?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          status?: string;
          score?: number | null;
          xp_earned?: number;
          progress?: number;
          current_step?: number | null;
          total_steps?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      payment_events: {
        Row: {
          id: string;
          provider: string;
          event_id: string | null;
          event_type: string;
          order_id: string | null;
          subscription_id: string | null;
          customer_email: string;
          customer_name: string | null;
          product_id: string | null;
          product_name: string | null;
          amount: number | null;
          currency: string;
          status: string;
          raw_payload: Json;
          processed: boolean;
          processing_error: string | null;
          user_id_matched: string | null;
          created_at: string;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          provider?: string;
          event_id?: string | null;
          event_type: string;
          order_id?: string | null;
          subscription_id?: string | null;
          customer_email: string;
          customer_name?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          amount?: number | null;
          currency?: string;
          status: string;
          raw_payload: Json;
          processed?: boolean;
          processing_error?: string | null;
          user_id_matched?: string | null;
          created_at?: string;
          processed_at?: string | null;
        };
        Update: {
          id?: string;
          provider?: string;
          event_id?: string | null;
          event_type?: string;
          order_id?: string | null;
          subscription_id?: string | null;
          customer_email?: string;
          customer_name?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          amount?: number | null;
          currency?: string;
          status?: string;
          raw_payload?: Json;
          processed?: boolean;
          processing_error?: string | null;
          user_id_matched?: string | null;
          created_at?: string;
          processed_at?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          payment_provider: string;
          external_customer_id: string | null;
          external_subscription_id: string | null;
          current_period_start: string;
          current_period_end: string | null;
          trial_end: string | null;
          cancel_at_period_end: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: string;
          status: string;
          payment_provider: string;
          external_customer_id?: string | null;
          external_subscription_id?: string | null;
          current_period_start: string;
          current_period_end?: string | null;
          trial_end?: string | null;
          cancel_at_period_end?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          status?: string;
          payment_provider?: string;
          external_customer_id?: string | null;
          external_subscription_id?: string | null;
          current_period_start?: string;
          current_period_end?: string | null;
          trial_end?: string | null;
          cancel_at_period_end?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_transactions: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          amount: number;
          currency: string;
          status: string;
          payment_provider: string;
          external_transaction_id: string | null;
          payment_method: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          amount: number;
          currency?: string;
          status: string;
          payment_provider: string;
          external_transaction_id?: string | null;
          payment_method?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          payment_provider?: string;
          external_transaction_id?: string | null;
          payment_method?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      progress_snapshots: {
        Row: {
          conversational_flow: number;
          created_at: string;
          cultural_fluency: number;
          date: string;
          id: string;
          pronunciation_clarity: number;
          speaking_confidence: number;
          student_id: string;
        };
        Insert: {
          conversational_flow?: number;
          created_at?: string;
          cultural_fluency?: number;
          date?: string;
          id?: string;
          pronunciation_clarity?: number;
          speaking_confidence?: number;
          student_id: string;
        };
        Update: {
          conversational_flow?: number;
          created_at?: string;
          cultural_fluency?: number;
          date?: string;
          id?: string;
          pronunciation_clarity?: number;
          speaking_confidence?: number;
          student_id?: string;
        };
        Relationships: [];
      };
      saved_expressions: {
        Row: {
          context: string | null;
          created_at: string;
          expression: string;
          id: string;
          student_id: string;
          translation: string | null;
        };
        Insert: {
          context?: string | null;
          created_at?: string;
          expression: string;
          id?: string;
          student_id: string;
          translation?: string | null;
        };
        Update: {
          context?: string | null;
          created_at?: string;
          expression?: string;
          id?: string;
          student_id?: string;
          translation?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_pending_payments: {
        Args: { user_email: string; user_id: string };
        Returns: number;
      };
    };
    Enums: {
      app_language: "pt" | "en" | "es";
      app_level: "beginner" | "intermediate" | "advanced";
      app_mood: "calm" | "intensive" | "cultural" | "confidence";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_language: ["pt", "en"],
      app_level: ["beginner", "intermediate", "advanced"],
      app_mood: ["calm", "intensive", "cultural", "confidence"],
    },
  },
} as const;
