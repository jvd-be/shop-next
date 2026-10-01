import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      match: [
        /^\d{6}$/,
        'کد تایید باید دقیقا ۶ رقم باشد'
      ]
    },

    expTime: {
      type: Date,
      required: true
    },

    times: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
)


otpSchema.index(
  { expTime: 1 },
  { expireAfterSeconds: 0 }
)

const Otp =
  mongoose.models.Otp ||
  mongoose.model('Otp', otpSchema)

export default Otp