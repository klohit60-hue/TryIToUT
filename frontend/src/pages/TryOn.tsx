import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, decrementTrialCredit } from '../firebase'
import UploadArea from '../components/UploadArea'
import { Download, Share2, RotateCcw, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const BACKGROUNDS = [
  'Plain White',
  'Library',
  'Party',
  'Beach',
  'Office',
  'Street',
  'Bedroom',
  'Living Room',
  'Cafe',
  'Park',
  'Studio Gray',
] as const

type BackgroundChoice = typeof BACKGROUNDS[number]

// API base: use Vite env if provided; otherwise localhost for local dev,
// and Heroku URL for non-local environments
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : 'https://tryitout-ai-06b6f1-1e7dca7aa188.herokuapp.com')

export default function TryOn() {
  const { user } = useAuth()
  const [userFile, setUserFile] = useState<File | null>(null)
  const [clothFile, setClothFile] = useState<File | null>(null)
  const [background, setBackground] = useState<BackgroundChoice>('Plain White')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [envLoading, setEnvLoading] = useState(false)
  const [envResults, setEnvResults] = useState<{ background: BackgroundChoice; src: string }[]>([])
  const [selected, setSelected] = useState<BackgroundChoice[]>([])
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [userPlan, setUserPlan] = useState<'trial' | 'pro'>('trial')

  const userInputRef = useRef<HTMLInputElement>(null)
  const clothInputRef = useRef<HTMLInputElement>(null)

  const canSubmit = useMemo(() => !!userFile && !!clothFile && !isLoading, [userFile, clothFile, isLoading])

  // Load user credits when component mounts or user changes
  useEffect(() => {
    const loadUserCredits = async () => {
      if (!user) {
        setUserCredits(null)
        setUserPlan('trial')
        return
      }

      try {
        const profile = await getUserProfile(user.id)
        if (profile) {
          setUserCredits(profile.trialCredits)
          setUserPlan(profile.plan)
        } else {
          // Fallback to user data from AuthContext
          setUserCredits(user.trialRemaining || 5)
          setUserPlan(user.plan)
        }
      } catch (err) {
        console.error('Failed to load user credits:', err)
        // Fallback to user data from AuthContext
        setUserCredits(user.trialRemaining || 5)
        setUserPlan(user.plan)
      }
    }

    loadUserCredits()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userFile || !clothFile) return
    
    // Check if user is signed in
    if (!user) {
      setError('Please sign in to use the try-on feature.')
      return
    }

    // Check user's credit balance
    try {
      const profile = await getUserProfile(user.id)
      if (!profile) {
        setError('Unable to load your profile. Please try again.')
        return
      }

      // Check if user has credits (trial users) or is pro
      if (profile.plan === 'trial' && profile.trialCredits <= 0) {
        setError('You have used all your free credits! Please upgrade to Pro to continue generating images.')
        return
      }
    } catch (err) {
      setError('Unable to check your credits. Please try again.')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('user_image', userFile)
      form.append('clothing_image', clothFile)
      form.append('background', background)
      form.append('variants', '1')

      const res = await fetch(`${API_BASE}/tryon`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Generation failed')
      }
      const data = (await res.json()) as { images_base64: string[] }
      const imgs = (data.images_base64 || []).map((b64) => `data:image/png;base64,${b64}`)
      setResults((prev) => [...imgs, ...prev])
      
      // Consume credit for trial users only
      try {
        const profile = await getUserProfile(user.id)
        if (profile && profile.plan === 'trial') {
          await decrementTrialCredit(user.id)
          // Update local state
          setUserCredits(prev => prev !== null ? Math.max(0, prev - 1) : 0)
        }
      } catch (err) {
        console.error('Failed to update credits:', err)
        // Don't show error to user as generation was successful
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSelected = async () => {
    if (!userFile || !clothFile || selected.length === 0) return
    
    // Check if user is signed in
    if (!user) {
      setError('Please sign in to use the try-on feature.')
      return
    }

    // Check user's credit balance for multiple generations
    try {
      const profile = await getUserProfile(user.id)
      if (!profile) {
        setError('Unable to load your profile. Please try again.')
        return
      }

      // Check if user has enough credits for all selected environments
      if (profile.plan === 'trial' && profile.trialCredits < selected.length) {
        setError(`You need ${selected.length} credits but only have ${profile.trialCredits} remaining. Please select fewer environments or upgrade to Pro.`)
        return
      }
    } catch (err) {
      setError('Unable to check your credits. Please try again.')
      return
    }

    setEnvLoading(true)
    setError(null)
    setEnvResults([])
    try {
      const fetchOne = async (bg: BackgroundChoice) => {
        const form = new FormData()
        form.append('user_image', userFile)
        form.append('clothing_image', clothFile)
        form.append('background', bg)
        const res = await fetch(`${API_BASE}/tryon`, { method: 'POST', body: form })
        if (!res.ok) throw new Error(await res.text())
        const data = (await res.json()) as { images_base64: string[] }
        const first = data.images_base64?.[0]
        if (!first) throw new Error('No image')
        return `data:image/png;base64,${first}`
      }

      const settled = await Promise.allSettled(selected.map((bg) => fetchOne(bg)))
      const next: { background: BackgroundChoice; src: string }[] = []
      settled.forEach((s, idx) => {
        if (s.status === 'fulfilled') {
          next.push({ background: selected[idx], src: s.value })
        }
      })
      next.sort((a, b) => (a.background === background ? -1 : b.background === background ? 1 : 0))
      setEnvResults(next)

      // Consume credits for trial users (one credit per successful generation)
      try {
        const profile = await getUserProfile(user.id)
        if (profile && profile.plan === 'trial') {
          const successfulGenerations = next.length
          for (let i = 0; i < successfulGenerations; i++) {
            await decrementTrialCredit(user.id)
          }
          // Update local state
          setUserCredits(prev => prev !== null ? Math.max(0, prev - successfulGenerations) : 0)
        }
      } catch (err) {
        console.error('Failed to update credits:', err)
        // Don't show error to user as generation was successful
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to generate environments')
    } finally {
      setEnvLoading(false)
    }
  }

  const resetForm = () => {
    setUserFile(null)
    setClothFile(null)
    userInputRef.current?.value && (userInputRef.current.value = '')
    clothInputRef.current?.value && (clothInputRef.current.value = '')
  }

  const handlePickEnvironment = (bg: BackgroundChoice, src: string) => {
    setBackground(bg)
    setResults((prev) => [src, ...prev])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-b from-white via-fuchsia-50 to-cyan-50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent">Virtual Try-On</h1>
        </div>

        {/* Credit Display */}
        {user && (
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${userPlan === 'pro' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {userPlan === 'pro' ? 'Pro Plan' : 'Trial Plan'}
                  </span>
                </div>
                {userPlan === 'trial' && userCredits !== null && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {userCredits} credit{userCredits !== 1 ? 's' : ''} remaining
                    </span>
                  </div>
                )}
                {userPlan === 'pro' && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Unlimited generations</span>
                  </div>
                )}
              </div>
              {userPlan === 'trial' && userCredits !== null && userCredits <= 2 && (
                <a 
                  href="/account" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Upgrade to Pro →
                </a>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Upload your photo</label>
            <UploadArea label="Your photo" onFile={(f) => setUserFile(f)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Upload clothing image</label>
            <UploadArea label="Clothing image" onFile={(f) => setClothFile(f)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Background</label>
            <select value={background} onChange={(e) => setBackground(e.target.value as BackgroundChoice)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
              {BACKGROUNDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Select environments to generate</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BACKGROUNDS.map((b) => {
                const checked = selected.includes(b)
                return (
                  <label key={b} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${checked ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checked}
                      onChange={() =>
                        setSelected((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))
                      }
                    />
                    {b}
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button disabled={!canSubmit} className="inline-flex items-center rounded-2xl bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading && (
                <span className="mr-2 inline-flex">
                  <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-200ms]" />
                  <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-100ms]" />
                  <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
                </span>
              )}
              Generate Try-On
            </button>
            <button type="button" disabled={!canSubmit || envLoading || selected.length === 0} onClick={handleGenerateSelected} className="inline-flex items-center rounded-2xl bg-cyan-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {envLoading && (
                <span className="mr-2 inline-flex">
                  <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-200ms]" />
                  <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-100ms]" />
                  <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
                </span>
              )}
              Generate Selected Environments
            </button>
            <button type="button" onClick={resetForm} className="rounded-2xl px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Reset</button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-3 text-lg font-medium">Preview</h2>
            <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl bg-gray-50">
              <AnimatePresence mode="wait">
                {results[0] && (
                  <motion.img
                    key={results[0]}
                    src={results[0]}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="max-h-[460px] w-full object-contain"
                  />
                )}
              </AnimatePresence>
              {!results[0] && (
                <div className="text-sm text-gray-500">Your generated result will appear here</div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <a href={results[0]} download={results[0] ? 'tryon.png' : undefined} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 border border-gray-200">
                <Download className="h-4 w-4"/> Download
              </a>
              <button onClick={() => navigator.share?.({ title: 'Virtual Try-On', url: results[0] }).catch(() => {})} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 border border-gray-200">
                <Share2 className="h-4 w-4"/> Share
              </button>
              <button onClick={resetForm} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 border border-gray-200">
                <RotateCcw className="h-4 w-4"/> Try Another
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-3 text-lg font-medium">Recent Results</h2>
            {results.length === 0 ? (
              <p className="text-sm text-gray-500">No results yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {results.map((src, idx) => (
                  <img key={idx} src={src} className="h-36 w-full rounded-xl object-cover shadow" />
                ))}
              </div>
            )}
          </div>
        </div>

        {envResults.length > 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-3 text-lg font-medium">Environment Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {envResults.map((item, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                  <img src={item.src} className="h-64 w-full object-cover" />
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-sm text-gray-700">{item.background}</div>
                    <button onClick={() => handlePickEnvironment(item.background, item.src)} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow hover:bg-indigo-700">Select</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


