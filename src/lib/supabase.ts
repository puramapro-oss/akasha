import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { createClient as createServiceRoleClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { APP_SCHEMA } from './constants'

// Browser client — used in 'use client' components
// MUST use createBrowserClient from @supabase/ssr for PKCE OAuth flow
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: APP_SCHEMA } }
  )
}

// Server client — used in Server Components and API Routes
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — cookies are read-only
          }
        },
      },
      db: { schema: APP_SCHEMA },
    }
  )
}

// Service role client — used for admin operations (server-side only)
export function createServiceClient() {
  return createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: APP_SCHEMA } }
  )
}
