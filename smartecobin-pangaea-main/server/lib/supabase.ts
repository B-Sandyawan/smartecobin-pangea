import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

// Initialize a regular (anon) Supabase client for client-like queries
export function initSupabase(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "⚠️  Missing SUPABASE_URL or SUPABASE_ANON_KEY. Using placeholder values for development."
    );
    // Return a client with placeholder values for development/testing
    return createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder_key"
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  console.log("✅ Supabase (anon) client ready");
  return supabaseClient;
}

// Initialize an admin (service_role) Supabase client for server-side admin operations
export function initSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      "⚠️  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Admin client will use placeholder values — admin operations may fail."
    );
    return createClient(supabaseUrl || "https://placeholder.supabase.co", serviceRoleKey || "placeholder_service_key");
  }

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey);
  console.log("✅ Supabase admin client ready");
  return supabaseAdminClient;
}

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    return initSupabaseAdmin();
  }
  return supabaseAdminClient;
}