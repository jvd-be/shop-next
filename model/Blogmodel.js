const { default: mongoose } = require('mongoose')

const Blogschema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String
    },

    description: {
      required: true,
      type: String
    },
    author: {
      required: true,
      type: String
    },

    coverImage: {
      required: true,
      type: String
    },
    isActive: {
      default: false,
      type: Boolean
    },
    body: [
      {
        subTitle: { type: String, required: true },
        subDescription: { type: String, required: true },
        subImages: { type: [String] }
      }
    ],
    slug: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
)

export default mongoose.models.Blog || mongoose.model('Blog', Blogschema)
