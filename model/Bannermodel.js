import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
{
  key: {
    type: String,
    required: true,
    unique: true,
    enum: [
      "Top-banner",
      "Hero-banner",
      "Promo-strip",
      "Middle-banner",
      "Category-banner",
      "Product-page-banner",
      "Cart-banner",
      "Checkout-banner",
      "Footer-banner"
    ]
  },

  title: String,
  subtitle: String,
  description: String,

  buttonText: String,
  buttonLink: String,
  height: String,

  variant: {
    type: String,
    enum: ["hero", "wide", "compact", "card"],
    default: "wide"
  },

  backgroundType: {
    type: String,
    enum: ["color", "image", "gradient"],
    default: "color"
  },

  image: String,
  mobileImage: String,

  bgColor: String,

  gradientFrom: String,
  gradientTo: String,

  textColor: {
    type: String,
    default: "#000"
  },

  overlay: {
    type: Boolean,
    default: false
  },

  overlayColor: {
    type: String,
    default: "rgba(0,0,0,.3)"
  },

  isActive: {
    type: Boolean,
    default: false
  },

  startDate: Date,
  endDate: Date
},
{ timestamps: true }
);

const BannerModel =
  mongoose.models.Banners || mongoose.model("Banners", BannerSchema);

export default BannerModel;
