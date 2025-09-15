import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    avatarUrl: { type: String },
    plan: { type: String, enum: ['trial', 'pro'], default: 'trial' },
    trialRemaining: { type: Number, default: 5 },
    stripeCustomerId: { type: String },
    provider: { type: String, enum: ['password', 'google'], default: 'password' },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)


