import mongoose from 'mongoose'

const TicketMessageSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'شناسه تیکت الزامی است'],
      index: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'شناسه فرستنده الزامی است'],
      index: true
    },

    senderRole: {
      type: String,
      enum: {
        values: ['USER', 'ADMIN'],
        message: '{VALUE} نقش فرستنده معتبر نیست'
      },
      required: [true, 'نقش فرستنده الزامی است']
    },

    message: {
      type: String,
      required: [true, 'متن پیام نمی‌تواند خالی باشد'],
      trim: true,
      maxlength: [4000, 'متن پیام نباید بیشتر از ۴۰۰۰ کاراکتر باشد']
    },

    attachments: [
      {
        url: {
          type: String,
          required: true
        },
        name: {
          type: String,
          default: ''
        },
        type: {
          type: String,
          default: ''
        },
        size: {
          type: Number,
          default: 0
        }
      }
    ],

    readByUser: {
      type: Boolean,
      default: false
    },

    readByAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

TicketMessageSchema.index({ ticket: 1, createdAt: 1 })
TicketMessageSchema.index({ ticket: 1, senderRole: 1 })
TicketMessageSchema.index({ sender: 1, createdAt: -1 })

export default mongoose.models.TicketMessage ||
  mongoose.model('TicketMessage', TicketMessageSchema)
