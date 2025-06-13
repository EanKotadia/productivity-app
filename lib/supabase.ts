import { createClient } from "@supabase/supabase-js"
import type { Database as DatabaseType } from "./database.types"

// Create a single supabase client for interacting with your database
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Add detailed logging for debugging
  console.log("Supabase environment variables check:", {
    url: supabaseUrl ? "✅ Set" : "❌ Missing",
    key: supabaseAnonKey ? "✅ Set" : "❌ Missing",
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    // Return a mock client that won't throw errors but won't work either
    // This prevents the app from crashing during development/preview
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () =>
          Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
        signUp: () =>
          Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ limit: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }) }),
        upsert: () => ({ select: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }) }),
      }),
    } as any
  }

  return createClient<DatabaseType>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

// Create a singleton instance
export const supabase = createSupabaseClient()

// Export the database types
export type Database = DatabaseType
