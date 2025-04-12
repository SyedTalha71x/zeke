import bcrypt from "bcrypt";
import User from "../Models/user-model.js";
import { failureResponse, successResponse } from "../Helpers/helper.js";

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json(
        failureResponse({
          error: "Current, new, and confirm passwords are required",
        })
      );
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json(failureResponse({ error: "Passwords do not match" }));
    }

    const userId = req.user?.userId;
    console.log(userId);
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(failureResponse({ error: "User not found" }));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(failureResponse({ error: "Current password is incorrect" }));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json(successResponse({}, "Password changed successfully"));
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json(failureResponse({ error: "Internal Server Error" }));
  }
};
export const updateUserProfile = async (req, res) => {
    const userId = req.user?.userId;
    const { name, email } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json(failureResponse({ error: "User not found" }));
      }
  
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
  
      await user.save();
  
      return res.json(successResponse({ message: "Profile updated successfully", user }));
    } catch (err) {
      return res.status(500).json(failureResponse({ error: "Server error" }));
    }
  };
  export const getUserProfile = async (req, res) => {
    try {
      const userId = req.user?.userId;
  
      const user = await User.findById(userId).select("-password -otp -otpExpiry");
  
      if (!user) {
        return res.status(404).json(failureResponse({ error: "User not found" }));
      }
  
      res.json(successResponse({ user }));
    } catch (err) {
      res.status(500).json(failureResponse({ error: "Server error" }));
    }
  };
