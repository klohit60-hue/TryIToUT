import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const nav = useNavigate()
  const { signin, signup } = useAuth()
  const [mode, setMode] = useState<'signin'|'signup'>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') await signup(name || undefined, email, password)
      else await signin(email, password)
      nav('/profile')
    } catch (err: any) {
      setError(err.message || 'Failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full border rounded-lg px-3 py-2" />
          )}
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded-lg px-3 py-2" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded-lg px-3 py-2" />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full rounded-xl bg-[#2962FF] text-white py-2 hover:bg-[#1f4ddb]">{loading ? 'Please wait...' : (mode==='signup'?'Sign up':'Sign in')}</button>
        </form>
        <div className="mt-3 text-sm text-gray-600">
          {mode==='signup' ? (
            <button className="underline" onClick={()=>setMode('signin')}>Have an account? Sign in</button>
          ) : (
            <button className="underline" onClick={()=>setMode('signup')}>New here? Create account</button>
          )}
        </div>
      </div>
    </div>
  )
}


