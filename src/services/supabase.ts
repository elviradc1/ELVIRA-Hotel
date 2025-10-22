import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔵 Supabase: Initializing client with:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "undefined",
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🔴 Supabase: Missing environment variables");
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Enhanced Supabase client with TypeScript support and real-time configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limiting for real-time events
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

console.log("🟢 Supabase: Client created successfully with real-time support");

// Type exports for convenience
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
