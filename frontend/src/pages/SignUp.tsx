import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { auth, ensureUserProfile } from '../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function SignUp() {
  const navigate = useNavigate()
  const [emailSent, setEmailSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const createAccount: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!auth) return
    const form = e.currentTarget as HTMLFormElement
    const email = (form.elements[1] as HTMLInputElement).value
    const password = (form.elements[2] as HTMLInputElement).value
    setLoading(true)
    setMessage(null)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(user)
      // Create initial profile (trial) immediately; user can use after email verification
      await ensureUserProfile({ uid: user.uid, email: user.email, displayName: user.displayName || undefined })
      setEmailSent(true)
      setMessage('Verification email sent. Please verify and then click "I\'ve verified".')
    } catch (err: any) {
      setMessage(err?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const checkEmailVerified = async () => {
    if (!auth?.currentUser) return
    setMessage(null)
    try {
      await auth.currentUser.reload()
      const ok = !!auth.currentUser.emailVerified
      setEmailVerified(ok)
      if (!ok) setMessage('Email not verified yet. Please click the link in your inbox.')
      else navigate('/app')
    } catch (_) {}
  }

  const signInWithGoogle = async () => {
    if (!auth) return
    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      await ensureUserProfile({ uid: user.uid, email: user.email, displayName: user.displayName || undefined })
      navigate('/app')
    } catch (err: any) {
      setMessage(err?.message || 'Google sign-in failed')
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px-56px)] flex items-center justify-center bg-gradient-to-b from-pink-50 via-violet-50 to-cyan-50 py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent">Create account</h1>
        <p className="mt-1 text-sm text-gray-600">Join TryItOut.Ai in seconds</p>

        <form className="mt-6 space-y-4" onSubmit={createAccount}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"/>
          </div>

          <button disabled={loading} type="submit" className="mt-2 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={checkEmailVerified} className="rounded-xl border px-3 py-2 text-sm">I've verified my email</button>
            {!emailVerified && emailSent && <span className="text-xs text-gray-600">Check your inbox/spam</span>}
          </div>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </div>

        <div className="mt-4">
          <button onClick={signInWithGoogle} className="w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-800 border border-gray-200 shadow hover:bg-gray-50">Continue with Google</button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/signin" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}


