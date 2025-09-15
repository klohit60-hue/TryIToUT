import { useEffect, useState } from 'react'
import { auth, getUserProfile, type UserProfile } from '../firebase'

export default function Account() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const uid = auth?.currentUser?.uid
      if (!uid) {
        setLoading(false)
        return
      }
      const p = await getUserProfile(uid)
      if (mounted) {
        setProfile(p)
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Account</h1>
      {loading ? (
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      ) : !auth?.currentUser ? (
        <p className="mt-4 text-sm text-gray-600">Please sign in to view your account.</p>
      ) : !profile ? (
        <p className="mt-4 text-sm text-gray-600">Profile not found. Try again shortly.</p>
      ) : (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow">
          <div className="text-sm text-gray-700">Email: {profile.email || auth.currentUser.email}</div>
          <div className="text-sm text-gray-700">Plan: {profile.plan}</div>
          {profile.plan === 'trial' && (
            <div className="text-sm text-gray-700">Trial credits left: {profile.trialCredits}</div>
          )}
          <div className="mt-4">
            <a href="#" className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700">Upgrade (coming soon)</a>
          </div>
        </div>
      )}
    </div>
  )
}


