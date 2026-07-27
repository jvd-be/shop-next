import mongoose from 'mongoose'


const popupSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ['home', 'wishlist', 'cart'],
      default: 'home',
      unique: true,
      required: true
    },

    title: {
      type: String,
      trim: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    backgroundType: {
      type: String,
      enum: ['image', 'color', 'gradient'],
      default: 'image'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    gradientFrom: {
      type: String,
      default: '#6366f1'
    },

    gradientTo: {
      type: String,
      default: '#2563eb'
    },
    textColor: {
      type: String,
      default: '#111827'
    },

    buttonColor: {
      type: String,
      default: '#000000'
    },
    overlayOpacity: {
      type: Number,
      min: 0,
      max: 100,
      default: 30
    },
    description: {
      type: String,
      trim: true
    },

    image: {
      type: String
    },

    buttonText: {
      type: String,
      default: ''
    },

    buttonLink: {
      type: String,
      default: ''
    },

    triggerType: {
      type: String,
      enum: ['delay', 'scroll', 'exitIntent', 'instant'],
      default: 'delay'
    },

    delay: {
      type: Number,
      default: 20
    },

    isActive: {
      type: Boolean,
      default: true
    },

    onlyGuest: {
      type: Boolean,
      default: false
    },

    frequency: {
      type: String,
      enum: ['once', 'oncePerDay', 'always'],
      default: 'oncePerDay'
    },

    deviceTarget: {
      type: String,
      enum: ['all', 'mobile', 'desktop'],
      default: 'all'
    },

    priority: {
      type: Number,
      default: 0
    },

    startDate: {
      type: Date,
      default: Date.now
    },

    endDate: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000
    }
  },
  { timestamps: true }
)

const PopupModel = mongoose.models.Popup || mongoose.model('Popup', popupSchema)

export default PopupModel
