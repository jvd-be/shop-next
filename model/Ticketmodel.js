import mongoose from 'mongoose'
import TicketCategorymodel from './TicketCategorymodel'
const TicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'شناسه کاربر الزامی است'],
      index: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketCategory',
      required: [true, 'انتخاب دسته‌بندی الزامی است'],
      index: true
    },

    subject: {
      type: String,
      required: [true, 'عنوان تیکت الزامی است'],
      trim: true,
      maxlength: [200, 'عنوان تیکت نباید بیشتر از ۲۰۰ کاراکتر باشد']
    },

    status: {
      type: String,
      enum: {
        values: ['open', 'answered', 'closed', 'unread'],
        message: '{VALUE} وضعیت معتبری نیست'
      },
      default: 'open',
      index: true
    },

    priority: {
      type: String,
      enum: {
        values: ['low', 'normal', 'high', 'urgent'],
        message: '{VALUE} اولویت معتبری نیست'
      },
      default: 'normal'
    },

    lastMessage: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'آخرین پیام نباید بیشتر از ۵۰۰ کاراکتر باشد']
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    lastSenderRole: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },

    unreadByAdmin: {
      type: Number,
      default: 0
    },

    unreadByUser: {
      type: Number,
      default: 0
    },

    closedAt: {
      type: Date,
      default: null
    },

    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
)

TicketSchema.index({ user: 1, status: 1 })
TicketSchema.index({ status: 1, lastMessageAt: -1 })
TicketSchema.index({ user: 1, lastMessageAt: -1 })

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema)
