import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import usageRoutes from './routes/usage.js'
import billingRoutes from './routes/billing.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'https://www.tryitout.ai'], credentials: true }))
app.use(express.json({ limit: '5mb' }))
app.use(cookieParser())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/usage', usageRoutes)
app.use('/api/billing', billingRoutes)

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tryitout'
const PORT = process.env.PORT || 4000

async function start() {
  await mongoose.connect(MONGO_URI)
  console.log('MongoDB connected')
  app.listen(PORT, () => console.log(`API listening on :${PORT}`))
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})


