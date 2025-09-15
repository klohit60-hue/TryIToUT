import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import User from '../models/User.js'

const router = Router()

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).lean()
  if (!user) return res.status(404).json({ error: 'Not found' })
  const { _id, name, email, avatarUrl, plan, trialRemaining } = user
  return res.json({ id: _id, name, email, avatarUrl, plan, trialRemaining })
})

router.post('/avatar', requireAuth, async (req, res) => {
  const { avatarUrl } = req.body
  await User.findByIdAndUpdate(req.userId, { avatarUrl })
  return res.json({ ok: true })
})

export default router


