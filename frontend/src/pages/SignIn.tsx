import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth, ensureUserProfile } from '../firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth'

export default function SignIn() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // If already signed in (e.g., Google redirect returned), go to dashboard
  useEffect(() => {
    if (auth?.currentUser) {
      navigate('/account', { replace: true })
    }
  }, [navigate])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!auth) return
    const form = e.currentTarget as HTMLFormElement
    const email = (form.elements[0] as HTMLInputElement).value
    const password = (form.elements[1] as HTMLInputElement).value
    setError(null)
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      await user.reload()
      if (!user.emailVerified) {
        setError('Please verify your email before signing in.')
        return
      }
      // Ensure navigation after auth state settles
      setTimeout(() => navigate('/account'), 50)
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    if (!auth) return
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      // Try popup first
      const { user } = await signInWithPopup(auth, provider)
      await ensureUserProfile({ uid: user.uid, email: user.email, displayName: user.displayName || undefined })
      setTimeout(() => navigate('/account'), 50)
    } catch (err: any) {
      const code = err?.code || ''
      // Fallback to redirect for COOP/cookie/popup issues
      if (
        code.includes('popup-blocked') ||
        code.includes('popup-closed-by-user') ||
        code.includes('unauthorized-domain') ||
        code.includes('internal-error') ||
        code.includes('operation-not-supported-in-this-environment')
      ) {
        try {
          const provider = new GoogleAuthProvider()
          provider.setCustomParameters({ prompt: 'select_account' })
          await signInWithRedirect(auth, provider)
          return
        } catch (redirectErr: any) {
          setError(redirectErr?.message || 'Google redirect sign-in failed')
          return
        }
      }
      setError(err?.message || 'Google sign-in failed')
    }
  }

  // Handle redirect result (returns user after signInWithRedirect)
  useEffect(() => {
    if (!auth) return
    ;(async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          await ensureUserProfile({ uid: result.user.uid, email: result.user.email, displayName: result.user.displayName || undefined })
          setTimeout(() => navigate('/account'), 50)
        }
      } catch (e: any) {
        // Surface but do not block UI
        console.warn('Google redirect result error:', e?.message || e)
      }
    })()
  }, [navigate])

  return (
    <div className="min-h-[calc(100vh-56px-56px)] flex items-center justify-center bg-gradient-to-b from-pink-50 via-violet-50 to-cyan-50 py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent">Sign in</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome back to TryItOut.Ai</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"/>
          </div>

          <button disabled={loading} type="submit" className="mt-2 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>

        <button onClick={signInWithGoogle} className="mt-3 w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-800 border border-gray-200 shadow hover:bg-gray-50">Continue with Google</button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 text-center text-sm text-gray-600">
          New here? <Link to="/signup" className="text-indigo-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}


