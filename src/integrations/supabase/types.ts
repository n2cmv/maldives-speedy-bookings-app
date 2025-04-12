export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
