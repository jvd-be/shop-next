import mongoose from 'mongoose'

const otpRateLimitSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0
    },

    windowStart: {
      type: Date,
      default: Date.now
    },

    lockedUntil: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const OtpRateLimit =
  mongoose.models.OtpRateLimit ||
  mongoose.model('OtpRateLimit', otpRateLimitSchema)

export default OtpRateLimit