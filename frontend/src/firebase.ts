import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier } from 'firebase/auth'
import { getFirestore, serverTimestamp, doc, getDoc, setDoc, runTransaction } from 'firebase/firestore'

const viteCfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let auth: ReturnType<typeof getAuth> | null = null
let db: ReturnType<typeof getFirestore> | null = null

async function init() {
  try {
    let cfg = viteCfg
    const missing = !cfg.apiKey || !cfg.authDomain || !cfg.projectId || !cfg.appId
    if (missing && typeof window !== 'undefined') {
      try {
        const res = await fetch('/firebase-config.json')
        if (res.ok) cfg = await res.json()
      } catch (_) {}
    }
    if (cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId) {
      const app = initializeApp(cfg)
      auth = getAuth(app)
      db = getFirestore(app)
    } else {
      // eslint-disable-next-line no-console
      console.warn('[Firebase] Missing env config. Skipping init. Set VITE_FIREBASE_* or Heroku config vars')
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Firebase] Init failed:', err)
  }
}

// kick off init (fire and forget)
void init()

export { auth }
export { RecaptchaVerifier }

// Profiles API (client-side convenience)
export type UserProfile = {
  email: string | null
  displayName?: string | null
  plan: 'trial' | 'pro'
  trialCredits: number
  createdAt: any
}

export async function ensureUserProfile(user: { uid: string; email: string | null; displayName?: string | null }) {
  if (!db) return
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    const profile: UserProfile = {
      email: user.email || null,
      displayName: user.displayName ?? null,
      plan: 'trial',
      trialCredits: 1, // one free try
      createdAt: serverTimestamp(),
    }
    await setDoc(ref, profile, { merge: true })
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return (snap.exists() ? (snap.data() as UserProfile) : null)
}

export async function decrementTrialCredit(uid: string): Promise<number> {
  if (!db) return 0
  const ref = doc(db, 'users', uid)
  const remaining = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    const data = snap.exists() ? (snap.data() as any) : {}
    const credits = Number(data.trialCredits ?? 0)
    const plan = data.plan || 'trial'
    if (plan === 'pro') return credits // no decrement for paid plan
    const next = Math.max(0, credits - 1)
    tx.set(ref, { trialCredits: next }, { merge: true })
    return next
  })
  return remaining
}

export { db }


