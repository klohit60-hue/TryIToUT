import { Router } from 'express'
import Stripe from 'stripe'
import { requireAuth } from '../middleware/auth.js'
import User from '../models/User.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2024-12-18.acacia' })

router.post('/checkout', requireAuth, async (req, res) => {
  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) return res.status(500).json({ error: 'Stripe price not configured' })
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ error: 'Not found' })
  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name || undefined })
    customerId = customer.id
    user.stripeCustomerId = customerId
    await user.save()
  }
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_BASE_URL || 'http://localhost:5173'}/profile?status=success`,
    cancel_url: `${process.env.CLIENT_BASE_URL || 'http://localhost:5173'}/profile?status=cancel`,
  })
  return res.json({ url: session.url })
})

// Webhook to upgrade plan
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    const event = endpointSecret ? stripe.webhooks.constructEvent(req.body, sig, endpointSecret) : JSON.parse(req.body)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerId = session.customer
      const user = await User.findOne({ stripeCustomerId: customerId })
      if (user) {
        user.plan = 'pro'
        await user.save()
      }
    }
    res.json({ received: true })
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

export default router


