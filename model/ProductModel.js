import mongoose from 'mongoose'
import Categorymodel from './Categorymodel'
import Reviewmodel from './Reviewmodel'


const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    images: { type: [String] },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },

    // ✅ ادمین فقط اینو وارد می‌کند
    price: { type: Number, required: true, min: 0 },

    // ✅ ادمین فقط اینو وارد می‌کند
    discount: { type: Number, default: 0, min: 0, max: 100 },

    // ✅ سیستم خودش محاسبه می‌کند
    finalPrice: { type: Number, min: 0 },

    totalQuantity: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    soldCount: { type: Number, default: 0 },

 
    variants: [
      {
        color: String,
        colorName: String,
        size: String,
        quantity: Number
      }
    ],

    averageRating: { type: Number, default: 0, min: 0, max: 5 }
  },
  { timestamps: true }
)



ProductSchema.index({ category: 1, isActive: 1 })
ProductSchema.index({ isFeatured: 1, isActive: 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ discount: 1, isActive: 1 })

export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema)
