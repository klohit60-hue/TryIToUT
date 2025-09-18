const API_BASE = import.meta.env.VITE_NODE_API_BASE || (location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://www.tryitout.ai')

export function getToken(): string | null {
  return localStorage.getItem('jwt')
}

export function setToken(token: string) {
  localStorage.setItem('jwt', token)
}

export function clearToken() {
  localStorage.removeItem('jwt')
}

export async function api(path: string, init: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(init.headers as any) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const authApi = {
  signup: (body: { name?: string; email: string; password: string }) => api('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  signin: (body: { email: string; password: string }) => api('/api/auth/signin', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/api/profile/me'),
}

export const usageApi = {
  check: () => api('/api/usage/check'),
  consume: () => api('/api/usage/consume', { method: 'POST' }),
}

export const billingApi = {
  checkout: () => api('/api/billing/checkout', { method: 'POST' }),
}


