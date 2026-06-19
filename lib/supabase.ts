import { createClient } from "@supabase/supabase-js";

// Project URL is public; the anon key is also safe to expose in the browser
// (writes are protected by Row Level Security). The service_role key is the
// SECRET one — it must NEVER live in client code or be committed.
// Both values are public by design (the anon key is shipped to the browser and
// protected by Row Level Security). Safe to commit. The service_role key is the
// secret one and must never appear here.
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://hiqmowapbdaspcxgoduv.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcW1vd2FwYmRhc3BjeGdvZHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTI3NjEsImV4cCI6MjA5NjAyODc2MX0.0Li8kgIjsofQrrSpexu3v2Z-De8gFHrGbyyNmofiyt8";

export const supabaseEnabled = Boolean(url && anonKey);

export const supabase = supabaseEnabled ? createClient(url, anonKey) : null;
