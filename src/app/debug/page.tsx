'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPage() {
  const [info, setInfo] = useState<any>({})

  useEffect(() => {
    async function run() {
      const supabase = createClient()

      // Check env vars
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setInfo((prev: any) => ({
        ...prev,
        envUrl: url ? url.substring(0, 30) + '...' : 'MISSING',
        envKey: key ? key.substring(0, 20) + '...' : 'MISSING',
      }))

      // Check session
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession()
        setInfo((prev: any) => ({
          ...prev,
          session: sessionData?.session ? 'EXISTS' : 'NULL',
          sessionError: sessionError?.message || 'none',
          userId: sessionData?.session?.user?.id || 'none',
          userEmail: sessionData?.session?.user?.email || 'none',
        }))

        // Check profile if session exists
        if (sessionData?.session?.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single()

          setInfo((prev: any) => ({
            ...prev,
            profile: profile ? JSON.stringify(profile) : 'NULL',
            profileError: profileError?.message || 'none',
            profileCode: profileError?.code || 'none',
          }))
        }
      } catch (e: any) {
        setInfo((prev: any) => ({
          ...prev,
          fatalError: e.message,
        }))
      }
    }

    run()
  }, [])

  return (
    <div style={{ padding: 40, background: '#0d0d18', minHeight: '100vh', color: '#fff', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#f0a500', marginBottom: 24 }}>🔍 Auth Debug</h1>
      <pre style={{ background: '#1e1e2e', padding: 20, borderRadius: 12, fontSize: 13, lineHeight: 1.8 }}>
        {JSON.stringify(info, null, 2)}
      </pre>

      <div style={{ marginTop: 24 }}>
        <a
          href="/login"
          style={{ color: '#f0a500', marginRight: 16 }}
        >
          → Go to Login
        </a>
        <a
          href="/dashboard"
          style={{ color: '#22d3ee' }}
        >
          → Go to Dashboard
        </a>
      </div>
    </div>
  )
}