import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

if (!supabaseUrl || !supabasePublishableKey) {
  const missing: string[] = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabasePublishableKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');

  console.error(
    `[Supabase Configuration] Missing required environment variable(s): ${missing.join(', ')}.\n` +
    `Please set them in .env.local for local development, or in Vercel project environment variables for production.`
  );
}

// Safe fallback URL and key ensure the application bundle compiles cleanly
// even if environment variables have not yet been placed in .env.local.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-key'
);
