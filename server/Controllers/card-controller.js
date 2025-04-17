import CardPack from "../Models/cardpack-model.js";
import { cloudinary } from "../Utils/cloudinary.js";
import fs from "fs";
import path from "path";

export const createCardPack = async (req, res) => {
  try {
    const { name, description, boxCount, cardsAvailable, price, category, inStock } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "Image is required" 
      });
    }

    const imageUrl = req.s3FileUrl || `/uploads/${req.file.filename}`;

    const newCardPack = new CardPack({
      name,
      description,
      boxCount: Number(boxCount),
      cardsAvailable: Number(cardsAvailable),
      price: Number(price),
      imageUrl: imageUrl,
      category,
      inStock,
      s3ImageUrl: req.s3FileUrl,
      localImageUrl: `/uploads/${req.file.filename}`
    });

    const savedCardPack = await newCardPack.save();
    
    res.status(201).json({ 
      success: true,
      message: "Card pack created successfully",
      cardPack: savedCardPack 
    });
    
  } catch (error) {
    console.error("Create Card Pack Error:", error);

    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAllCardPacks = async (req, res) => {
  try {
    const cardPacks = await CardPack.find().sort({ createdAt: -1 });
    res.status(200).json(cardPacks);
  } catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
};

export const getCardPackById = async (req, res) => {
  try {
    const cardPack = await CardPack.findById(req.params.id);
    if (!cardPack) {
      return res.status(404).json({ message: "Card pack not found" });
    }
    res.status(200).json(cardPack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCardPack = async (req, res) => {
  try {
    const {
      name,
      description,
      boxCount,
      cardsAvailable,
      price,
      category,
      inStock,
    } = req.body;

    const cardPack = await CardPack.findById(req.params.id);
    if (!cardPack) {
      return res.status(404).json({ success: false, message: "Card pack not found" });
    }

    const updatedCard = {};

    if (name !== undefined) updatedCard.name = name;
    if (description !== undefined) updatedCard.description = description;
    if (boxCount !== undefined) updatedCard.boxCount = Number(boxCount);
    if (cardsAvailable !== undefined) updatedCard.cardsAvailable = Number(cardsAvailable);
    if (price !== undefined) updatedCard.price = Number(price);
    if (category !== undefined) updatedCard.category = category;
    if (typeof inStock !== "undefined") updatedCard.inStock = inStock;

    if (req.file) {
      // Optionally delete old local image
      if (cardPack.localImageUrl) {
        const oldLocalPath = path.join("uploads", path.basename(cardPack.localImageUrl));
        if (fs.existsSync(oldLocalPath)) {
          fs.unlinkSync(oldLocalPath);
        }
      }

      updatedCard.imageUrl = req.s3FileUrl || `/uploads/${req.file.filename}`;
      updatedCard.s3ImageUrl = req.s3FileUrl;
      updatedCard.localImageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedCardPack = await CardPack.findByIdAndUpdate(
      req.params.id,
      { $set: updatedCard },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Card pack updated successfully",
      cardPack: updatedCardPack,
    });

  } catch (error) {
    console.error("Update Card Pack Error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


export const deleteCardPack = async (req, res) => {
  try {
    const cardPack = await CardPack.findById(req.params.id);

    if (!cardPack) {
      return res.status(404).json({ message: "Card pack not found" });
    }

    await CardPack.findByIdAndDelete(cardPack)

    res.status(200).json({
      success: true,
      message: "Card pack deleted successfully",
    });
  } catch (error) {
    console.error("Delete Card Pack Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


