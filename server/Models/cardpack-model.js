import mongoose from "mongoose";

const cardPackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  boxCount: {
    type: Number,
    required: true,
    min: 1
  },
  cardsAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const CardPack = mongoose.models.CardPack || mongoose.model('CardPack', cardPackSchema);

export default CardPack;