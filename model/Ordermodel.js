// models/Ordermodel.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        name: String, // ذخیره نام محصول در لحظه خرید (اگر بعدا نام محصول تغییر کرد)
        price: Number, // ذخیره قیمت در لحظه خرید
        quantity: Number,
        colorName: String,
        size: String
      }
    ],
    itemsTotal: { type: Number, required: true }, // جمع قیمت آیتم‌ها بدون ارسال
    shippingCost: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true }, // itemsTotal + shippingCost - discountAmount
    status: {
      type: String,
      enum: [
        "PROCESSING",
        "SHIPPED",
        "CANCELLED"
      ],
      default: "PROCESSING",
      index: true
    },
    address: {
      city: String,
      street: String,
      postalCode: String,
      receiverName: String,
      receiverPhone: String
    },
    paymentMethod: { type: String, default: "ONLINE" },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    paymentAuthority: { type: String, index: true },
    trackingCode: String
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);