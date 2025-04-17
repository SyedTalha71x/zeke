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
  category:{
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true
  },
  s3ImageUrl:{
    type: String,
  },
  localImageUrl:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const CardPack = mongoose.models.CardPack || mongoose.model('CardPack', cardPackSchema);

export default CardPack;