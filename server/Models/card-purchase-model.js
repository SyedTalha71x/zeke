import mongoose from "mongoose";

const cardPurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardPackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardPack',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CardPurchase = mongoose.models.CardPurchase || mongoose.model('CardPurchase', cardPurchaseSchema);

export default CardPurchase;
