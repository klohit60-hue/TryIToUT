import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { auth, RecaptchaVerifier } from '../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, linkWithPhoneNumber } from 'firebase/auth'

export default function SignUp() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState<any>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneLinked, setPhoneLinked] = useState(false)
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
      setEmailSent(true)
      setMessage('Verification email sent. Please verify and then click "I\'ve verified".')
    } catch (err: any) {
      setMessage(err?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async () => {
    if (!auth || !phone) return
    setMessage(null)
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
      const conf = await linkWithPhoneNumber(auth.currentUser!, phone, verifier)
      setConfirmation(conf)
      setMessage('OTP sent to your phone')
    } catch (err: any) {
      setMessage(err?.message || 'Failed to send OTP')
    }
  }

  const verifyOtp = async () => {
    if (!confirmation) return
    setMessage(null)
    try {
      await confirmation.confirm(otp)
      setPhoneLinked(true)
      setMessage('Phone number verified and linked')
    } catch (err: any) {
      setMessage(err?.message || 'Invalid OTP')
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
    } catch (_) {}
  }

  const canContinue = emailVerified && phoneLinked

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

          <div className="pt-4 border-t border-gray-200" />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone (with country code)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1XXXXXXXXXX" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            <div id="recaptcha-container" className="mt-2" />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={sendOtp} className="rounded-xl border px-3 py-2 text-sm">Send OTP</button>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="flex-1 rounded-xl border px-3 py-2 text-sm" />
              <button type="button" onClick={verifyOtp} className="rounded-xl bg-indigo-600 px-3 py-2 text-sm text-white">Verify</button>
            </div>
          </div>
        </form>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={checkEmailVerified} className="rounded-xl border px-3 py-2 text-sm">I've verified my email</button>
            {!emailVerified && emailSent && <span className="text-xs text-gray-600">Check your inbox/spam</span>}
          </div>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </div>

        <div className="mt-4">
          <button disabled={!canContinue} onClick={() => navigate('/app')} className="w-full rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50">Continue</button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/signin" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}


