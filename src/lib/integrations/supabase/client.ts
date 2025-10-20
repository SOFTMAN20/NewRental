// Supabase client configuration with environment variables
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('Environment variables check:', {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY: SUPABASE_PUBLISHABLE_KEY ? 'Present' : 'Missing',
  allEnvVars: import.meta.env
});

// Validate environment variables
if (!SUPABASE_URL) {
  console.error('VITE_SUPABASE_URL is missing or empty:', SUPABASE_URL);
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  console.error('VITE_SUPABASE_ANON_KEY is missing or empty:', SUPABASE_PUBLISHABLE_KEY);
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Validate URL format
try {
  new URL(SUPABASE_URL);
} catch (error) {
  console.error('Invalid SUPABASE_URL format:', SUPABASE_URL);
  throw new Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Got: ${SUPABASE_URL}`);
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security
  },
  global: {
    headers: {
      'X-Client-Info': 'nyumbalink-web',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limit realtime events
    },
  },
});