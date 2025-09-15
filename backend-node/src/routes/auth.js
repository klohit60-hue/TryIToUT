import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { signToken } from '../middleware/auth.js'
import User from '../models/User.js'

const router = Router()

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ error: 'Email already in use' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })
  const token = signToken(user.id)
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan, trialRemaining: user.trialRemaining } })
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signToken(user.id)
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan, trialRemaining: user.trialRemaining } })
})

export default router


