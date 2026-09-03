import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../db/types";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Respects the current user's session via cookies, so RLS
 * policies apply exactly as they would for that user in the browser.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component; middleware handles refresh instead.
        }
      },
    },
  });
}
