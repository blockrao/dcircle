import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a public-key Supabase client on demand.
 *
 * This intentionally exposes no service-role client and no generic write
 * helpers. Public access must be constrained by reviewed database RLS policies.
 * Do not wire this into public routes until the actual schema and policies have
 * been audited.
 */
export function createPublicSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
