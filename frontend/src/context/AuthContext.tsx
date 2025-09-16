import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi, setToken, clearToken, getToken } from '../lib/api'
import { auth as fbAuth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

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
      const unsub = onAuthStateChanged(fbAuth, (u) => {
        if (u) {
          setUser({ id: u.uid, email: u.email || '', name: u.displayName || undefined, plan: 'trial' })
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
  const signout = () => { clearToken(); setUser(null) }

  return <Ctx.Provider value={{ user, loading, signin, signup, signout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}


