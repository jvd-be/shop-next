import mongoose from "mongoose"

const SocialItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ["instagram", "whatsapp", "telegram", "eitaa", "rubika", "custom"],
      default: "custom"
    },
    value: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: true }
)

const SocialSchema = new mongoose.Schema(
  {
    items: {
      type: [SocialItemSchema],
      default: []
    }
  },
  { timestamps: true }
)

export default mongoose.models.Socials ||
  mongoose.model("Socials", SocialSchema)
