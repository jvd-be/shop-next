const { default: mongoose } = require('mongoose')

const DiscountSchema = new mongoose.Schema(
  {
    code: {
      required: true,
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 4,
      maxlength: 24
    },
    typediscount: {
      required: true,
      type: String,
      enum: ['Percent', 'Shipping', 'Fixed']
    },
    value: {
      type: Number,
      required: true
    },
    status: {
      required: true,
      type: Boolean,
      default: false
    },
    usageLimit: {
      type: Number,
      default: null
    },
    usedCount: {
      type: Number,
      default: 0
    },
    minPurchase: {
      type: Number,
      default: 0
    },
    perUserLimit: {
      type: Number,
      default: 1
    },
    firstPurchaseOnly: {
      type: Boolean,
      default: false
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    expiredDate: {
      type: Date
    }
  },
  { timestamps: true }
)

module.exports =
  mongoose.models.Discountmodel ||
  mongoose.model('Discountmodel', DiscountSchema)
