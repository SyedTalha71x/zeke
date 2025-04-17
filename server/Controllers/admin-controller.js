import CardPurchase from "../Models/card-purchase-model.js";
import CardPack from "../Models/cardpack-model.js";
import Contact from "../Models/contact-model.js";
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

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCardPacks = await CardPack.countDocuments();

    const successfulPurchases = await CardPurchase.find({ status: 'succeeded' });

    const totalSales = successfulPurchases.length;

    const totalRevenue = successfulPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCardPacks,
        totalSales,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};

export const getNotifications = async (req, res) =>{
  try {
    const getNotificationsAll = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(getNotificationsAll);
  } catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
}

export const markNotificationAsRead = async (req, res) => {

  try {

    const { id } = req.params;

    const notification = await Contact.findByIdAndUpdate(id, { isRead: 1 }, { new: true });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Marked as read', data: notification });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

