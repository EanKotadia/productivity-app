import { createClient } from "@supabase/supabase-js"

// Use the environment variables that are available in the project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Add detailed logging for debugging
console.log("Supabase environment variables check:", {
  url: supabaseUrl ? "✅ Set" : "❌ Missing",
  key: supabaseAnonKey ? "✅ Set" : "❌ Missing",
  urlValue: supabaseUrl?.substring(0, 10) + "...",
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:", {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          university: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          university?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          university?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brain_dumps: {
        Row: {
          id: string
          user_id: string
          raw_text: string
          processed_data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          raw_text: string
          processed_data?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          raw_text?: string
          processed_data?: any
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          priority: "high" | "medium" | "low"
          due_date: string | null
          subject: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          priority?: "high" | "medium" | "low"
          due_date?: string | null
          subject?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          priority?: "high" | "medium" | "low"
          due_date?: string | null
          subject?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          subject: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          subject?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          subject?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
