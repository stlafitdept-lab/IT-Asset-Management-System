'use client'

import { useEffect, useReducer, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { User } from '@supabase/supabase-js'

interface AuthState { user: User | null; profile: Profile | null; loading: boolean }
type AuthAction = { type: 'LOADED'; user: User | null; profile: Profile | null } | { type: 'SIGNED_OUT' }

function reducer(s: AuthState, a: AuthAction): AuthState {
  switch (a.type) {
    case 'LOADED': return { user: a.user, profile: a.profile, loading: false }
    case 'SIGNED_OUT': return { user: null, profile: null, loading: false }
    default: return s
  }
}

// Cache to avoid re-fetching on every page navigation
let cachedUser: User | null = null
let cachedProfile: Profile | null = null
let hasLoaded = false

export function useAuth() {
  const [state, dispatch] = useReducer(reducer, {
    user: cachedUser,
    profile: cachedProfile,
    loading: !hasLoaded,
  })
  const done = useRef(false)

  useEffect(() => {
    // Skip if already loaded from cache
    if (hasLoaded && cachedUser) {
      dispatch({ type: 'LOADED', user: cachedUser, profile: cachedProfile })
      done.current = true
      return
    }

    const supabase = createClient()
    let mounted = true

    async function fetchProfile(uid: string): Promise<Profile | null> {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
        return data as Profile | null
      } catch { return null }
    }

    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        if (!session?.user) {
          dispatch({ type: 'LOADED', user: null, profile: null })
          hasLoaded = true; done.current = true
          return
        }
        const profile = await fetchProfile(session.user.id)
        if (!mounted) return

        // Cache results
        cachedUser = session.user
        cachedProfile = profile
        hasLoaded = true

        dispatch({ type: 'LOADED', user: session.user, profile })
        done.current = true
      } catch {
        if (mounted) {
          dispatch({ type: 'LOADED', user: null, profile: null })
          hasLoaded = true; done.current = true
        }
      }
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted || !done.current) return
      if (event === 'SIGNED_OUT') {
        cachedUser = null; cachedProfile = null; hasLoaded = false
        dispatch({ type: 'SIGNED_OUT' })
        return
      }
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const profile = await fetchProfile(session.user.id)
        if (!mounted) return
        cachedUser = session.user; cachedProfile = profile; hasLoaded = true
        dispatch({ type: 'LOADED', user: session.user, profile })
      }
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    cachedUser = null; cachedProfile = null; hasLoaded = false; done.current = false
    await createClient().auth.signOut()
    dispatch({ type: 'SIGNED_OUT' })
    window.location.href = '/login'
  }

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    isAdmin: state.profile?.role === 'admin',
    isHR: state.profile?.role === 'hr',
    signIn,
    signOut,
  }
}