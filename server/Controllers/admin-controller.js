import CardPack from "../Models/cardpack-model.js";
import User from "../Models/user-model.js";

export const getAllProducts = async (req,res) =>{
    try {
        const cardPacks = await CardPack.find().sort({ createdAt: -1 });
        res.status(200).json(cardPacks);
      } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
      }
}

export const getAllUsers = async (req,res) =>{
  try {
      const userLists = await User.find().sort({ createdAt: -1 });
      res.status(200).json(userLists);
    } catch (error) {
      res.status(500).json({message: 'Internal Server Error'});
    }
}