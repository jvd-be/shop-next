import mongoose from 'mongoose'

const GeneralSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true
    },

    siteDescription: {
      type: String,
      default: ''
    },

    siteUrl: {
      type: String,
      default: ''
    },

    siteLogo: {
      type: String,
      default: ''
    },

    favicon: {
      type: String,
      default: ''
    },

    defaultOgImage: {
      type: String,
      default: ''
    },

    twitterHandle: {
      type: String,
      default: ''
    },

    titleFormat: {
      type: String,
      default: '%pageTitle% | %siteName%'
    },

    robotsDefault: {
      type: String,
      default: 'index, follow'
    },

    maintenanceMode: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, collection: 'generalseo' }
)

export default mongoose.models.Generalseo ||
  mongoose.model('Generalseo', GeneralSchema)
