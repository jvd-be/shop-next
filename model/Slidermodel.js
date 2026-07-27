import mongoose from 'mongoose'

const slideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: ''
    },

    subtitle: {
      type: String,
      trim: true,
      default: ''
    },

    description: {
      type: String,
      trim: true,
      default: ''
    },

    imageDesktop: {
      type: String,
      required: true,
      trim: true
    },

    imageMobile: {
      type: String,
      trim: true,
      default: ''
    },

    overlay: {
      type: Boolean,
      default: false
    },

    overlayOpacity: {
      type: Number,
      min: 0,
      max: 100,
      default: 20
    },

    textPosition: {
      type: String,
      enum: [
        'top-left',
        'top-center',
        'top-right',
        'center-left',
        'center',
        'center-right',
        'bottom-left',
        'bottom-center',
        'bottom-right'
      ],
      default: 'center-left'
    },

    textColor: {
      type: String,
      default: '#ffffff'
    },

    buttonText: {
      type: String,
      trim: true,
      default: ''
    },

    buttonLink: {
      type: String,
      trim: true,
      default: ''
    },

    openInNewTab: {
      type: Boolean,
      default: false
    },

    priority: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    startDate: {
      type: Date
    },

    endDate: {
      type: Date
    }
  },
  { _id: true }
)

const sliderSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ['home-hero', 'home-middle', 'category-top'],
      required: true,
      unique: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    slides: {
      type: [slideSchema],
      default: [],
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: 'Slider must contain at least one slide'
      }
    },

    autoplay: {
      type: Boolean,
      default: true
    },

    autoplayDelay: {
      type: Number,
      default: 5000,
      min: 1000
    },

    loop: {
      type: Boolean,
      default: true
    },

    showNavigation: {
      type: Boolean,
      default: true
    },

    showPagination: {
      type: Boolean,
      default: true
    },

    draggable: {
      type: Boolean,
      default: true
    },

    pauseOnHover: {
      type: Boolean,
      default: true
    },

    animation: {
      type: String,
      enum: ['slide', 'fade'],
      default: 'slide'
    },
    
    mobileAspectRatio: {
      type: String,
      default: '12/11'
    },

    desktopAspectRatio: {
      type: String,
      default: '999/260'
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
)

const SliderModel =
  mongoose.models.Slider || mongoose.model('Slider', sliderSchema)

export default SliderModel
