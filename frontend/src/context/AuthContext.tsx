import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi, setToken, clearToken, getToken } from '../lib/api'
import { auth as fbAuth, getUserProfile } from '../firebase'
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth'

type User = { id: string; email: string; name?: string; plan: 'trial'|'pro'; trialRemaining?: number }

type AuthCtx = {
  user: User | null
  loading: boolean
  signin: (email: string, password: string) => Promise<void>
  signup: (name: string | undefined, email: string, password: string) => Promise<void>
  signout: () => void
}

const Ctx = createContext<AuthCtx | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      authApi.me().then((u) => setUser(u)).finally(() => setLoading(false))
    } else if (fbAuth) {
      const unsub = onAuthStateChanged(fbAuth, async (u) => {
        if (u) {
          // Get user profile from Firebase Firestore
          const profile = await getUserProfile(u.uid)
          if (profile) {
            setUser({ 
              id: u.uid, 
              email: u.email || '', 
              name: u.displayName || undefined, 
              plan: profile.plan,
              trialRemaining: profile.trialCredits
            })
          } else {
                    // Fallback to basic user info if no profile exists
                    setUser({ 
                      id: u.uid, 
                      email: u.email || '', 
                      name: u.displayName || undefined, 
                      plan: 'trial',
                      trialRemaining: 100
                    })
          }
        } else if (!getToken()) {
          setUser(null)
        }
        setLoading(false)
      })
      return () => unsub()
    } else {
      setLoading(false)
    }
  }, [])

  const signin = async (email: string, password: string) => {
    const data = await authApi.signin({ email, password })
    setToken(data.token)
    setUser(data.user)
  }
  const signup = async (name: string | undefined, email: string, password: string) => {
    const data = await authApi.signup({ name, email, password })
    setToken(data.token)
    setUser(data.user)
  }
  const signout = async () => { 
    clearToken()
    if (fbAuth?.currentUser) {
      await fbSignOut(fbAuth)
    }
    setUser(null) 
  }

  return <Ctx.Provider value={{ user, loading, signin, signup, signout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}


