import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier } from 'firebase/auth'

const viteCfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let auth: ReturnType<typeof getAuth> | null = null

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


