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
      analytics_events: {
        Row: {
          event_type: string
          id: string
          metadata: Json | null
          property_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          metadata?: Json | null
          property_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          metadata?: Json | null
          property_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_stats"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student_dashboard_stats"
            referencedColumns: ["student_id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          confirmation_code: string | null
          confirmed_at: string | null
          created_at: string | null
          id: string
          landlord_user_id: string
          lease_duration: string | null
          move_in_date: string
          property_id: string
          room_type: string
          status: string | null
          student_user_id: string
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          booking_date?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmation_code?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          landlord_user_id: string
          lease_duration?: string | null
          move_in_date: string
          property_id: string
          room_type: string
          status?: string | null
          student_user_id: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmation_code?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          landlord_user_id?: string
          lease_duration?: string | null
          move_in_date?: string
          property_id?: string
          room_type?: string
          status?: string | null
          student_user_id?: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_landlord_user_id_fkey"
            columns: ["landlord_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_landlord_user_id_fkey"
            columns: ["landlord_user_id"]
            isOneToOne: false
            referencedRelation: "student_dashboard_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_stats"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "bookings_student_user_id_fkey"
            columns: ["student_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_student_user_id_fkey"
            columns: ["student_user_id"]
            isOneToOne: false
            referencedRelation: "student_dashboard_stats"
            referencedColumns: ["student_id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_stats"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student_dashboard_stats"
            referencedColumns: ["student_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          budget_max: number | null
          budget_min: number | null
          business_registration_number: string | null
          course_of_study: string | null
          created_at: string | null
          email: string
          full_name: string | null
          government_id_number: string | null
          id: string
          phone: string | null
          physical_address: string | null
          preferred_roommate_gender: string | null
          university_id: string | null
          updated_at: string | null
          user_type: string
          verification_status: string | null
          year_of_study: number | null
        }
        Insert: {
          avatar_url?: string | null
          budget_max?: number | null
          budget_min?: number | null
          business_registration_number?: string | null
          course_of_study?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          government_id_number?: string | null
          id: string
          phone?: string | null
          physical_address?: string | null
          preferred_roommate_gender?: string | null
          university_id?: string | null
          updated_at?: string | null
          user_type: string
          verification_status?: string | null
          year_of_study?: number | null
        }
        Update: {
          avatar_url?: string | null
          budget_max?: number | null
          budget_min?: number | null
          business_registration_number?: string | null
          course_of_study?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          government_id_number?: string | null
          id?: string
          phone?: string | null
          physical_address?: string | null
          preferred_roommate_gender?: string | null
          university_id?: string | null
          updated_at?: string | null
          user_type?: string
          verification_status?: string | null
          year_of_study?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          accepted_payment_methods: string[] | null
          additional_fees: Json | null
          address: string
          amenities: Json | null
          available_beds: number | null
          available_move_in_dates: string[] | null
          bed_count: number | null
          city: string
          contact_phone: string | null
          contact_whatsapp_phone: string | null
          created_at: string | null
          deposit_amount: number | null
          description: string | null
          distance_from_campus: number | null
          full_address: string | null
          gender_restrictions: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          landlord_id: string
          latitude: number | null
          lease_periods: string[] | null
          longitude: number | null
          monthly_rent: number
          payment_schedule: string | null
          property_type: string | null
          region: string
          room_type: string
          status: string | null
          title: string
          university_id: string | null
          updated_at: string | null
          utilities_included: boolean | null
        }
        Insert: {
          accepted_payment_methods?: string[] | null
          additional_fees?: Json | null
          address: string
          amenities?: Json | null
          available_beds?: number | null
          available_move_in_dates?: string[] | null
          bed_count?: number | null
          city: string
          contact_phone?: string | null
          contact_whatsapp_phone?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          description?: string | null
          distance_from_campus?: number | null
          full_address?: string | null
          gender_restrictions?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          landlord_id: string
          latitude?: number | null
          lease_periods?: string[] | null
          longitude?: number | null
          monthly_rent: number
          payment_schedule?: string | null
          property_type?: string | null
          region: string
          room_type: string
          status?: string | null
          title: string
          university_id?: string | null
          updated_at?: string | null
          utilities_included?: boolean | null
        }
        Update: {
          accepted_payment_methods?: string[] | null
          additional_fees?: Json | null
          address?: string
          amenities?: Json | null
          available_beds?: number | null
          available_move_in_dates?: string[] | null
          bed_count?: number | null
          city?: string
          contact_phone?: string | null
          contact_whatsapp_phone?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          description?: string | null
          distance_from_campus?: number | null
          full_address?: string | null
          gender_restrictions?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          landlord_id?: string
          latitude?: number | null
          lease_periods?: string[] | null
          longitude?: number | null
          monthly_rent?: number
          payment_schedule?: string | null
          property_type?: string | null
          region?: string
          room_type?: string
          status?: string | null
          title?: string
          university_id?: string | null
          updated_at?: string | null
          utilities_included?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "student_dashboard_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "properties_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      property_inquiries: {
        Row: {
          created_at: string | null
          id: string
          inquiry_date: string | null
          landlord_user_id: string
          message: string
          property_id: string
          response_date: string | null
          status: string | null
          student_user_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inquiry_date?: string | null
          landlord_user_id: string
          message: string
          property_id: string
          response_date?: string | null
          status?: string | null
          student_user_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inquiry_date?: string | null
          landlord_user_id?: string
          message?: string
          property_id?: string
          response_date?: string | null
          status?: string | null
          student_user_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_inquiries_landlord_user_id_fkey"
            columns: ["landlord_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_inquiries_landlord_user_id_fkey"
            columns: ["landlord_user_id"]
            isOneToOne: false
            referencedRelation: "student_dashboard_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "property_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_stats"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "property_inquiries_student_user_id_fkey"
            columns: ["student_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_inquiries_student_user_id_fkey"
            columns: ["student_user_id"]
            isOneToOne: false
            referencedRelation: "student_dashboard_stats"
            referencedColumns: ["student_id"]
          },
        ]
      }
      universities: {
        Row: {
          abbreviation: string
          campus_locations: string[] | null
          city: string
          created_at: string | null
          email_domains: string[]
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          region: string
          updated_at: string | null
        }
        Insert: {
          abbreviation: string
          campus_locations?: string[] | null
          city: string
          created_at?: string | null
          email_domains: string[]
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          region: string
          updated_at?: string | null
        }
        Update: {
          abbreviation?: string
          campus_locations?: string[] | null
          city?: string
          created_at?: string | null
          email_domains?: string[]
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          region?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      landlord_dashboard_stats: {
        Row: {
          confirmed_bookings: number | null
          landlord_id: string | null
          pending_bookings: number | null
          pending_inquiries: number | null
          total_available_beds: number | null
          total_properties: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "student_dashboard_stats"
            referencedColumns: ["student_id"]
          },
        ]
      }
      property_stats: {
        Row: {
          confirmed_bookings_count: number | null
          favorites_count: number | null
          inquiries_count: number | null
          property_id: string | null
          title: string | null
          university_id: string | null
          views_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      student_dashboard_stats: {
        Row: {
          active_bookings_count: number | null
          pending_inquiries_count: number | null
          saved_properties_count: number | null
          student_id: string | null
          university_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_confirmation_code: { Args: never; Returns: string }
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
