import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema(
{
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    maxlength: 1000
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  adminReply: {
    text: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: null
    }
  }

},
{ timestamps: true }
)


// جلوگیری از ثبت چند نظر برای یک محصول توسط یک کاربر
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })


export default mongoose.models.Review ||
mongoose.model("Review", ReviewSchema)
