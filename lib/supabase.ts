import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { LocalDiscoveryDatabase } from "./local-discovery-database.types";

/**
 * Creates a public-key client for the canonical local-discovery schema.
 *
 * This intentionally exposes no service-role client and no generic write
 * helpers. RLS and explicit grants limit public reads to published records.
 * Editorial writes must use a separately authorized server-side path.
 */
export function createPublicSupabaseClient(): SupabaseClient<LocalDiscoveryDatabase> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient<LocalDiscoveryDatabase>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
