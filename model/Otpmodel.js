// path: @/model/Otpmodel.js
import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true, // جلوگیری از ایجاد رکوردهای تکراری برای یک شماره
      trim: true
    },
    code: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'کد تایید باید دقیقا ۶ رقم باشد'] // اعتبارسنجی دقیق طول کد
    },
    expTime: {
      type: Date,
      required: true
    },
    times: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true // فیلدهای createdAt و updatedAt را برای لاگ زمان و بررسی Rate Limit می‌سازد
  }
)

// فعال‌سازی ایندکس TTL روی فیلد expTime برای حذف خودکار داده‌ها
otpSchema.index({ expTime: 1 }, { expireAfterSeconds: 0 })

const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema)

export default Otp
