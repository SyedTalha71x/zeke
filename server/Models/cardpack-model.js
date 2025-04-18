import mongoose from "mongoose";

const cardPackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  boxCount: {
    type: Number,
    required: true,
    min: 1
  },
  cardsAvailable: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true
  },
  s3ImageUrl: {
    type: String,
  },
  localImageUrl: {
    type: String,
  },
  tier1CardsCount: {
    type: Number,
    required: true,
    default: 0
  },
  tier2CardsCount: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add virtual for cards relationship
cardPackSchema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'cardPack'
});

cardPackSchema.set('toJSON', { virtuals: true });
cardPackSchema.set('toObject', { virtuals: true });

const CardPack = mongoose.models.CardPack || mongoose.model('CardPack', cardPackSchema);

export default CardPack;