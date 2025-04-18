import { get } from "mongoose";
import Card from "../Models/card-model.js";
import CardPack from "../Models/cardpack-model.js";
import { cloudinary } from "../Utils/cloudinary.js";
import fs from "fs";
import path from "path";

export const createCard = async (req, res) => {
  try {
    const { name, description, tier, rarity, cardPackId } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "Card image is required" 
      });
    }

    const cardPack = await CardPack.findById(cardPackId);
    if (!cardPack) {
      return res.status(404).json({ 
        success: false,
        message: "Card pack not found" 
      });
    }

    const imageUrl = req.s3FileUrl || `/uploads/${req.file.filename}`;

    const newCard = new Card({
      name,
      description,
      tier: Number(tier),
      rarity,
      imageUrl,
      cardPack: cardPackId,
      s3ImageUrl: req.s3FileUrl,
      localImageUrl: `/uploads/${req.file.filename}`
    });

    const savedCard = await newCard.save();

    res.status(201).json({ 
      success: true,
      message: "Card created successfully",
      card: savedCard 
    });
    
  } catch (error) {
    console.error("Create Card Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getCardsByPack = async (req, res) => {
  try {
    const { packId } = req.params;
    
    const cards = await Card.find({ cardPack: packId });
    
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAllCards = async (req,res) =>{
  try{
    const getAllCards = await Card.find().populate('cardPack');
    return res.status(201).json(getAllCards)
  }
  catch(error){
    console.log(error)
    return ;
    
  }
}

export const updateCard = async (req, res) => {
  try {
    const { name, description, tier, rarity } = req.body;
    const { id } = req.params;

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ 
        success: false,
        message: "Card not found" 
      });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (tier !== undefined) updates.tier = Number(tier);
    if (rarity !== undefined) updates.rarity = rarity;

    if (req.file) {
      // Optionally delete old local image
      if (card.localImageUrl) {
        const oldLocalPath = path.join("uploads", path.basename(card.localImageUrl));
        if (fs.existsSync(oldLocalPath)) {
          fs.unlinkSync(oldLocalPath);
        }
      }

      updates.imageUrl = req.s3FileUrl || `/uploads/${req.file.filename}`;
      updates.s3ImageUrl = req.s3FileUrl;
      updates.localImageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      card: updatedCard
    });

  } catch (error) {
    console.error("Update Card Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findByIdAndDelete(id);
    if (!card) {
      return res.status(404).json({ 
        success: false,
        message: "Card not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Card deleted successfully"
    });

  } catch (error) {
    console.error("Delete Card Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};