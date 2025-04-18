import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
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
  imageUrl: {
    type: String,
    required: true
  },
  tier: {
    type: Number,
    required: true,
    enum: [1, 2],
    default: 2
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  cardPack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardPack',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);

export default Card;