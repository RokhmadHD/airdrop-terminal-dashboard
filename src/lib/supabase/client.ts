// src/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

// Fungsi ini akan membuat Supabase client yang aman untuk digunakan di browser.
export function createClient() {
  // Pastikan variabel environment sudah di-set di file .env.local
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase URL and Anon Key must be defined in .env.local");
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}