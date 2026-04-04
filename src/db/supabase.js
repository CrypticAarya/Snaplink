import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
