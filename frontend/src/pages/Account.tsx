import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api, billingApi } from '../lib/api'

type Profile = { id: string; name?: string; email: string; avatarUrl?: string; plan: 'trial'|'pro'; trialRemaining?: number }

export default function Account() {
  const { user, signout } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!user) { setLoading(false); return }
      const p = await api('/api/profile/me')
      if (mounted) { setProfile(p); setLoading(false) }
    })()
    return () => { mounted = false }
  }, [user])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Account</h1>
      {loading ? (
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      ) : !user ? (
        <p className="mt-4 text-sm text-gray-600">Please sign in to view your account.</p>
      ) : !profile ? (
        <p className="mt-4 text-sm text-gray-600">Profile not found. Try again shortly.</p>
      ) : (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow">
          <div className="text-sm text-gray-700">Name: {profile.name || '—'}</div>
          <div className="text-sm text-gray-700">Email: {profile.email}</div>
          <div className="text-sm text-gray-700">Plan: {profile.plan === 'pro' ? 'Pro (Unlimited)' : 'Trial'}</div>
          {profile.plan !== 'pro' && (
            <div className="text-sm text-gray-700">Trial credits left: {profile.trialRemaining ?? 0}</div>
          )}
          <div className="mt-4 flex gap-3">
            <a href="/app" className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700">Access Virtual Try-On</a>
            {profile.plan !== 'pro' && (
              <button className="rounded-xl border px-4 py-2" onClick={async () => {
                const { url } = await billingApi.checkout()
                window.location.href = url
              }}>Upgrade</button>
            )}
            <button className="rounded-xl border px-4 py-2" onClick={signout}>Sign out</button>
          </div>
        </div>
      )}
    </div>
  )
}


