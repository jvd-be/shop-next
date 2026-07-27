const { default: mongoose } = require('mongoose')

const CategorySchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      trim: true
    },
    slug: {
      required: true,
      type: String,
      unique: true,
      lowercase: true
    },
    isActive: {
      default: true,
      type: Boolean
    },
    order: {
      required: true,
      type: Number
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    level: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: '',
      maxlength: 500
    }
  },
  { timestamps: true }
)



export default mongoose.models.Category ||
  mongoose.model('Category', CategorySchema)
