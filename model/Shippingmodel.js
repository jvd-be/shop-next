const { default: mongoose } = require('mongoose')

const ShippingSchema = new mongoose.Schema(
  {
    fullThreshold: {
      type: Number,
      required: true,
      default: 0
    },

    halfThreshold: {
      type: Number,
      required: true,
      default: 0
    },

    freeThreshold: {
      type: Number,
      required: true,
      default: 0
    },

    fullShippingCost: {
      type: Number,
      required: true,
      default: 0
    },

    halfShippingCost: {
      type: Number,
      required: true,
      default: 0
    },

    freeShippingCost: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
)

const ShippingModel =
  mongoose.models.Shippingmodel || mongoose.model('Shippingmodel', ShippingSchema)

export default ShippingModel
