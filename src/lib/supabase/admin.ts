import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/types";
import { getSupabaseUrl } from "./env";

/**
 * Service-role Supabase client. Bypasses RLS — server-only, never import
 * this from a Client Component or expose the key to the browser.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  return createSupabaseClient<Database>(getSupabaseUrl(), serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
