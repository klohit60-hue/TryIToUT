import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth, RecaptchaVerifier } from '../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPhoneNumber } from 'firebase/auth'

export default function SignUp() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState<any>(null)

  useEffect(() => {
    if (!('grecaptcha' in window)) return
  }, [])
  return (
    <div className="min-h-[calc(100vh-56px-56px)] flex items-center justify-center bg-gradient-to-b from-pink-50 via-violet-50 to-cyan-50 py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent">Create account</h1>
        <p className="mt-1 text-sm text-gray-600">Join TryItOut.Ai in seconds</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            // Form elements
            const form = e.currentTarget as HTMLFormElement
            const name = (form.elements[0] as HTMLInputElement).value
            const email = (form.elements[1] as HTMLInputElement).value
            const password = (form.elements[2] as HTMLInputElement).value
            // Create email user and send verification
            if (!auth) return
            createUserWithEmailAndPassword(auth, email, password)
              .then(async ({ user }) => {
                await sendEmailVerification(user)
                // proceed to app (or show toast)
                navigate('/app')
              })
              .catch(() => {})
          }}
        >
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

          <button type="submit" className="mt-2 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90">Sign up</button>

          <div className="pt-4 border-t border-gray-200" />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone (with country code)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1XXXXXXXXXX" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            <div id="recaptcha-container" className="mt-2" />
            <div className="flex gap-2">
              <button type="button" className="rounded-xl border px-3 py-2 text-sm" onClick={async () => {
                try {
                  // Setup invisible reCAPTCHA
                  // @ts-ignore
                  if (!auth) return
                  const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
                  const conf = await signInWithPhoneNumber(auth, phone, verifier)
                  setConfirmation(conf)
                } catch (_) {}
              }}>Send OTP</button>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="flex-1 rounded-xl border px-3 py-2 text-sm" />
              <button type="button" className="rounded-xl bg-indigo-600 px-3 py-2 text-sm text-white" onClick={async () => {
                try {
                  if (!confirmation) return
                  await confirmation.confirm(otp)
                  navigate('/app')
                } catch (_) {}
              }}>Verify</button>
            </div>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/signin" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}


