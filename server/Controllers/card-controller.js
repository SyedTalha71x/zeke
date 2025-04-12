import { failureResponse, successResponse } from "../Helpers/helper.js";
import CardPack from "../Models/cardpack-model.js";
import { cloudinary } from "../Utils/cloudinary.js";
import fs from "fs";
import path from "path";

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "card-packs",
    });

    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error; // This will be caught by the createCardPack catch block
  }
};

export const createCardPack = async (req, res) => {
    try {
      const { name, description, boxCount, cardsAvailable, price } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: "Image is required" 
        });
      }
  
      const imageUrl = `/uploads/${req.file.filename}`;
  
      const newCardPack = new CardPack({
        name,
        description,
        boxCount: Number(boxCount),
        cardsAvailable: Number(cardsAvailable),
        price: Number(price),
        imageUrl: imageUrl,
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
    const cardPack = await CardPack.findById(req.params.id);
    if (!cardPack) {
      return res.status(404).json({ message: "Card pack not found" });
    }

    const { name, description, boxCount, cardsAvailable, price } = req.body;

    // Update fields
    cardPack.name = name || cardPack.name;
    cardPack.description = description || cardPack.description;
    cardPack.boxCount = boxCount || cardPack.boxCount;
    cardPack.cardsAvailable = cardsAvailable || cardPack.cardsAvailable;
    cardPack.price = price || cardPack.price;

    // Handle image update if new file provided
    if (req.file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(cardPack.imagePublicId);

      // Upload new image
      const image = await uploadImage(req.file);
      cardPack.imageUrl = image.url;
      cardPack.imagePublicId = image.publicId;
    }

    const updatedCardPack = await cardPack.save();
    res.status(200).json(updatedCardPack);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCardPack = async (req, res) => {
  try {
    const cardPack = await CardPack.findById(req.params.id);

    if (!cardPack) {
      return res.status(404).json({ message: "Card pack not found" });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(cardPack.imagePublicId);

    // Delete card pack from database
    await cardPack.remove();

    res.status(200).json({ message: "Card pack deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
