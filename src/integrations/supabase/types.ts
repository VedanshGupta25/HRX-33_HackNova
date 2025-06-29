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
      child_missions: {
        Row: {
          assigned_date: string | null
          child_id: string | null
          completion_date: string | null
          created_at: string | null
          id: string
          mission_id: string | null
          started_date: string | null
          status: Database["public"]["Enums"]["mission_status"] | null
        }
        Insert: {
          assigned_date?: string | null
          child_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          mission_id?: string | null
          started_date?: string | null
          status?: Database["public"]["Enums"]["mission_status"] | null
        }
        Update: {
          assigned_date?: string | null
          child_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          mission_id?: string | null
          started_date?: string | null
          status?: Database["public"]["Enums"]["mission_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "child_missions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "diy_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      child_profiles: {
        Row: {
          age: number | null
          created_at: string | null
          grade_level: string | null
          id: string
          interests: string[] | null
          learning_style: Database["public"]["Enums"]["learning_style"] | null
          skill_level: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          grade_level?: string | null
          id?: string
          interests?: string[] | null
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          skill_level?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          grade_level?: string | null
          id?: string
          interests?: string[] | null
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          skill_level?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_skills: {
        Row: {
          child_id: string | null
          date_mastered: string | null
          id: string
          proficiency_level: string | null
          skill_id: string | null
        }
        Insert: {
          child_id?: string | null
          date_mastered?: string | null
          id?: string
          proficiency_level?: string | null
          skill_id?: string | null
        }
        Update: {
          child_id?: string | null
          date_mastered?: string | null
          id?: string
          proficiency_level?: string | null
          skill_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_skills_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      diy_missions: {
        Row: {
          age_range: string | null
          complexity_level: string | null
          created_at: string | null
          description: string | null
          id: string
          learning_focus: string[] | null
          suitable_for_family: boolean | null
          theme: string | null
          title: string
        }
        Insert: {
          age_range?: string | null
          complexity_level?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          learning_focus?: string[] | null
          suitable_for_family?: boolean | null
          theme?: string | null
          title: string
        }
        Update: {
          age_range?: string | null
          complexity_level?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          learning_focus?: string[] | null
          suitable_for_family?: boolean | null
          theme?: string | null
          title?: string
        }
        Relationships: []
      }
      family_pathway_progress: {
        Row: {
          child_id: string | null
          completed_date: string | null
          created_at: string | null
          family_id: string | null
          id: string
          pathway_id: string | null
          progress_data: Json | null
          started_date: string | null
        }
        Insert: {
          child_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          pathway_id?: string | null
          progress_data?: Json | null
          started_date?: string | null
        }
        Update: {
          child_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          pathway_id?: string | null
          progress_data?: Json | null
          started_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_pathway_progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_pathway_progress_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "learning_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      family_projects: {
        Row: {
          child_id: string | null
          created_at: string | null
          description: string | null
          id: string
          parent_id: string | null
          shared_tasks: Json | null
          status: Database["public"]["Enums"]["project_status"] | null
          theme: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          parent_id?: string | null
          shared_tasks?: Json | null
          status?: Database["public"]["Enums"]["project_status"] | null
          theme?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          parent_id?: string | null
          shared_tasks?: Json | null
          status?: Database["public"]["Enums"]["project_status"] | null
          theme?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_projects_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_projects_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_pathways: {
        Row: {
          content_items: Json | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          id: string
          suggested_ages: string | null
          theme: string
          title: string
        }
        Insert: {
          content_items?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          suggested_ages?: string | null
          theme: string
          title: string
        }
        Update: {
          content_items?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          suggested_ages?: string | null
          theme?: string
          title?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          achieved_date: string | null
          celebration_suggestions: string[] | null
          child_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_notified: boolean | null
          milestone_name: string
        }
        Insert: {
          achieved_date?: string | null
          celebration_suggestions?: string[] | null
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_notified?: boolean | null
          milestone_name: string
        }
        Update: {
          achieved_date?: string | null
          celebration_suggestions?: string[] | null
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_notified?: boolean | null
          milestone_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_chat_history: {
        Row: {
          answer: string | null
          created_at: string | null
          id: string
          parent_id: string | null
          question: string
        }
        Insert: {
          answer?: string | null
          created_at?: string | null
          id?: string
          parent_id?: string | null
          question: string
        }
        Update: {
          answer?: string | null
          created_at?: string | null
          id?: string
          parent_id?: string | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_chat_history_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_child_relationships: {
        Row: {
          child_id: string | null
          created_at: string | null
          id: string
          parent_id: string | null
          relationship_type: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          parent_id?: string | null
          relationship_type?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          parent_id?: string | null
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_relationships_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          experience_level: string | null
          first_name: string | null
          id: string
          interests: string[] | null
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          first_name?: string | null
          id: string
          interests?: string[] | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          first_name?: string | null
          id?: string
          interests?: string[] | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          ai_explanation_for_parents: string | null
          ai_summary: string | null
          child_id: string | null
          code_snapshot: string | null
          completion_date: string | null
          created_at: string | null
          description: string | null
          id: string
          learning_objectives: string[] | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_explanation_for_parents?: string | null
          ai_summary?: string | null
          child_id?: string | null
          code_snapshot?: string | null
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          learning_objectives?: string[] | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_explanation_for_parents?: string | null
          ai_summary?: string | null
          child_id?: string | null
          code_snapshot?: string | null
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          learning_objectives?: string[] | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_minutes: number
          focus_score: number | null
          id: string
          session_type: string
          started_at: string
          subject: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_minutes: number
          focus_score?: number | null
          id?: string
          session_type?: string
          started_at?: string
          subject?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          focus_score?: number | null
          id?: string
          session_type?: string
          started_at?: string
          subject?: string | null
          user_id?: string
        }
        Relationships: []
      }
      task_completions: {
        Row: {
          completed_at: string
          completion_time_minutes: number | null
          created_at: string
          difficulty: string
          id: string
          subject: string
          task_title: string
          task_type: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string
          completion_time_minutes?: number | null
          created_at?: string
          difficulty: string
          id?: string
          subject: string
          task_title: string
          task_type: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string
          completion_time_minutes?: number | null
          created_at?: string
          difficulty?: string
          id?: string
          subject?: string
          task_title?: string
          task_type?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      user_learning_paths: {
        Row: {
          completed_steps: number
          created_at: string
          current_step: number
          id: string
          last_activity: string | null
          path_name: string
          progress_percentage: number | null
          started_at: string
          total_steps: number
          user_id: string
        }
        Insert: {
          completed_steps?: number
          created_at?: string
          current_step?: number
          id?: string
          last_activity?: string | null
          path_name: string
          progress_percentage?: number | null
          started_at?: string
          total_steps?: number
          user_id: string
        }
        Update: {
          completed_steps?: number
          created_at?: string
          current_step?: number
          id?: string
          last_activity?: string | null
          path_name?: string
          progress_percentage?: number | null
          started_at?: string
          total_steps?: number
          user_id?: string
        }
        Relationships: []
      }
      user_performance: {
        Row: {
          average_focus_score: number | null
          completion_rate: number | null
          created_at: string
          id: string
          streak_days: number | null
          subjects_studied: string[] | null
          total_study_hours: number | null
          total_tasks_completed: number | null
          updated_at: string
          user_id: string
          week_start_date: string
        }
        Insert: {
          average_focus_score?: number | null
          completion_rate?: number | null
          created_at?: string
          id?: string
          streak_days?: number | null
          subjects_studied?: string[] | null
          total_study_hours?: number | null
          total_tasks_completed?: number | null
          updated_at?: string
          user_id: string
          week_start_date: string
        }
        Update: {
          average_focus_score?: number | null
          completion_rate?: number | null
          created_at?: string
          id?: string
          streak_days?: number | null
          subjects_studied?: string[] | null
          total_study_hours?: number | null
          total_tasks_completed?: number | null
          updated_at?: string
          user_id?: string
          week_start_date?: string
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
      learning_style:
        | "visual"
        | "auditory"
        | "kinesthetic"
        | "reading_writing"
        | "problem_solver"
      mission_status: "available" | "assigned" | "in_progress" | "completed"
      project_status: "draft" | "in_progress" | "completed" | "archived"
      user_role: "parent" | "child" | "admin"
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
    Enums: {
      learning_style: [
        "visual",
        "auditory",
        "kinesthetic",
        "reading_writing",
        "problem_solver",
      ],
      mission_status: ["available", "assigned", "in_progress", "completed"],
      project_status: ["draft", "in_progress", "completed", "archived"],
      user_role: ["parent", "child", "admin"],
    },
  },
} as const
