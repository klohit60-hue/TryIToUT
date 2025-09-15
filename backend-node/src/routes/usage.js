import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import User from '../models/User.js'

const router = Router()

// Check access for try-on
router.get('/check', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ error: 'Not found' })
  const allowed = user.plan === 'pro' || (user.trialRemaining ?? 0) > 0
  return res.json({ allowed, plan: user.plan, trialRemaining: user.trialRemaining })
})

// Decrement a credit on successful generation
router.post('/consume', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ error: 'Not found' })
  if (user.plan !== 'pro') {
    if ((user.trialRemaining ?? 0) <= 0) return res.status(402).json({ error: 'No trial credits left' })
    user.trialRemaining = Math.max(0, (user.trialRemaining ?? 0) - 1)
    await user.save()
  }
  return res.json({ ok: true, trialRemaining: user.trialRemaining })
})

export default router


