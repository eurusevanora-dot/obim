// Cliente Supabase del navegador. Mismo proyecto que NEXUS-METADATA (donde
// viven las tablas obim_*). Valores públicos (URL + anon) fijados en código
// para que cliente y servidor apunten siempre al mismo proyecto.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://irpkofhsaahwwkyszmzm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycGtvZmhzYWFod3dreXN6bXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTE2MzcsImV4cCI6MjA5NjA4NzYzN30.IEJ9Poiboah08rXQtGa6PUFVrNlxpTsLTgTDc3p2Z7E";

function createSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
