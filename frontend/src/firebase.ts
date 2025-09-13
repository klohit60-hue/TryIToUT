import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier } from 'firebase/auth'

// Read Vite env vars (may be undefined in local until configured)
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let auth: ReturnType<typeof getAuth> | null = null
try {
  // Only initialize if all required keys exist
  if (cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId) {
    const app = initializeApp(cfg)
    auth = getAuth(app)
  } else {
    // eslint-disable-next-line no-console
    console.warn('[Firebase] Missing env config. Skipping init. Set VITE_FIREBASE_* in frontend/.env')
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('[Firebase] Init failed:', err)
}

export { auth }
// reCAPTCHA will be created on demand on the SignUp page
export { RecaptchaVerifier }


