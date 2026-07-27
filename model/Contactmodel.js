import mongoose from 'mongoose'

const ContactInfoSchema = new mongoose.Schema(
  {
    mobilePhone: {
      type: String,
      required: [true, 'شماره همراه الزامی است'],
      trim: true,
      match: [
        /^(?:\+98|0)?9\d{9}$/,
        'فرمت شماره همراه معتبر نیست'
      ]
    },

    storePhone: {
      type: String,
      required: [true, 'شماره فروشگاه الزامی است'],
      trim: true,
      match: [
        /^(?:\+98|0)?[1-8]\d{9}$/,
        'فرمت شماره فروشگاه معتبر نیست'
      ]
    },

    email: {
      type: String,
      required: [true, 'ایمیل الزامی است'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'فرمت ایمیل معتبر نیست'
      ]
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.ContactInfo ||
  mongoose.model('ContactInfo', ContactInfoSchema)
