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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_id: string
          created_at: string
          description: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          description: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          description?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      bml_transactions: {
        Row: {
          amount: number
          booking_reference: string | null
          created_at: string
          currency: string
          customer_reference: string | null
          id: string
          local_id: string | null
          provider: string
          state: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_reference?: string | null
          created_at?: string
          currency: string
          customer_reference?: string | null
          id?: string
          local_id?: string | null
          provider: string
          state: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_reference?: string | null
          created_at?: string
          currency?: string
          customer_reference?: string | null
          id?: string
          local_id?: string | null
          provider?: string
          state?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_otps: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp_code: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp_code: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          activity: string | null
          created_at: string
          departure_date: string
          departure_time: string
          from_location: string
          id: string
          is_activity_booking: boolean | null
          passenger_count: number
          passenger_info: Json
          payment_complete: boolean | null
          payment_reference: string | null
          return_date: string | null
          return_from_location: string | null
          return_time: string | null
          return_to_location: string | null
          return_trip: boolean | null
          to_location: string
          updated_at: string
          user_email: string
        }
        Insert: {
          activity?: string | null
          created_at?: string
          departure_date: string
          departure_time: string
          from_location: string
          id?: string
          is_activity_booking?: boolean | null
          passenger_count: number
          passenger_info: Json
          payment_complete?: boolean | null
          payment_reference?: string | null
          return_date?: string | null
          return_from_location?: string | null
          return_time?: string | null
          return_to_location?: string | null
          return_trip?: boolean | null
          to_location: string
          updated_at?: string
          user_email: string
        }
        Update: {
          activity?: string | null
          created_at?: string
          departure_date?: string
          departure_time?: string
          from_location?: string
          id?: string
          is_activity_booking?: boolean | null
          passenger_count?: number
          passenger_info?: Json
          payment_complete?: boolean | null
          payment_reference?: string | null
          return_date?: string | null
          return_from_location?: string | null
          return_time?: string | null
          return_to_location?: string | null
          return_trip?: boolean | null
          to_location?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      islands: {
        Row: {
          accommodation: Json[] | null
          activities: Json[] | null
          created_at: string
          description: string
          dining: Json[] | null
          essential_info: Json[] | null
          faqs: Json[] | null
          full_description: string | null
          gallery_images: string[] | null
          hero_image: string | null
          id: string
          image_url: string | null
          location: Json | null
          name: string
          quick_facts: Json[] | null
          slug: string | null
          tagline: string | null
          travel_info: Json | null
          updated_at: string
          weather: Json | null
        }
        Insert: {
          accommodation?: Json[] | null
          activities?: Json[] | null
          created_at?: string
          description: string
          dining?: Json[] | null
          essential_info?: Json[] | null
          faqs?: Json[] | null
          full_description?: string | null
          gallery_images?: string[] | null
          hero_image?: string | null
          id?: string
          image_url?: string | null
          location?: Json | null
          name: string
          quick_facts?: Json[] | null
          slug?: string | null
          tagline?: string | null
          travel_info?: Json | null
          updated_at?: string
          weather?: Json | null
        }
        Update: {
          accommodation?: Json[] | null
          activities?: Json[] | null
          created_at?: string
          description?: string
          dining?: Json[] | null
          essential_info?: Json[] | null
          faqs?: Json[] | null
          full_description?: string | null
          gallery_images?: string[] | null
          hero_image?: string | null
          id?: string
          image_url?: string | null
          location?: Json | null
          name?: string
          quick_facts?: Json[] | null
          slug?: string | null
          tagline?: string | null
          travel_info?: Json | null
          updated_at?: string
          weather?: Json | null
        }
        Relationships: []
      }
      routes: {
        Row: {
          created_at: string
          display_order: number | null
          duration: number
          from_location: string
          id: string
          pickup_location: string | null
          pickup_map_url: string | null
          price: number
          speedboat_image_url: string | null
          speedboat_name: string | null
          timings: string[] | null
          to_location: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          duration: number
          from_location: string
          id?: string
          pickup_location?: string | null
          pickup_map_url?: string | null
          price: number
          speedboat_image_url?: string | null
          speedboat_name?: string | null
          timings?: string[] | null
          to_location: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          duration?: number
          from_location?: string
          id?: string
          pickup_location?: string | null
          pickup_map_url?: string | null
          price?: number
          speedboat_image_url?: string | null
          speedboat_name?: string | null
          timings?: string[] | null
          to_location?: string
          updated_at?: string
        }
        Relationships: []
      }
      tour_packages: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          duration: string
          gallery_images: string[] | null
          id: string
          image_url: string | null
          inclusions: string[] | null
          is_active: boolean | null
          min_pax: number | null
          name: string
          price_per_person: number
          rules: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration: string
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          inclusions?: string[] | null
          is_active?: boolean | null
          min_pax?: number | null
          name: string
          price_per_person: number
          rules?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          inclusions?: string[] | null
          is_active?: boolean | null
          min_pax?: number | null
          name?: string
          price_per_person?: number
          rules?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_user: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
