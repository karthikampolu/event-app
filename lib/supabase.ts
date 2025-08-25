import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create client with explicit any typing to bypass TypeScript issues
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Export with stronger type assertion
export const supabase = supabaseClient as any;
