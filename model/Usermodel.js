import mongoose from 'mongoose'
import ProductModel from '@/model/ProductModel'
const AddressSchema = new mongoose.Schema(
  {
    isDefault: { type: Boolean, default: false },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    plaque: { type: String, required: true, trim: true },
    unit: { type: String, trim: true },
    postalCode: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true }
  },
  { timestamps: true }
)

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 64,
      default: ''
    },

    email: {
      type: String,
      default: undefined,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'ایمیل معتبر نیست']
    },

    phone: {
      type: String,
      required: true,
      unique: true
      // match: [/^09\d{9}$/, "شماره موبایل معتبر نیست"]
    },

    // password: {
    //   type: String,
    //   required: true,
    //   select: false
    // },

    avatar: {
      type: String,
      default: ''
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isBanned: {
      type: Boolean,
      default: false
    },

    addresses: [AddressSchema],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],

    cart: {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          variantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1
          },
          size: String,
          stock: Number,
          colorName: String,
          color: String,
          title: String,
          price: Number,
          oldPrice: Number,
          discount: Number,
          image: String
        }
      ],
      updatedAt: { type: Date, default: Date.now }
    },

    totalOrders: {
      type: Number,
      default: 0
    },

    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
