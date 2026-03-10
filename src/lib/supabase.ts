import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Use createBrowserClient for better SSR support and PKCE flow
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
