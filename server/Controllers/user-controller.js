import { failureResponse, successResponse } from "../Helpers/helper.js";
import User from "../Models/user-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Helpers/helper.js";
import nodemailer from "nodemailer";
import CardPurchase from "../Models/card-purchase-model.js";

export const Signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json(failureResponse({ error: "Please enter all fields" }));
    }

    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json(failureResponse({ error: "User already exists" }));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let role = "user";

    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(200).json(successResponse({}, "User signup successfully "));
  } catch (err) {
    console.error(err.message);
    return res
      .status(400)
      .json(failureResponse({ error: "Internal Server Error" }));
  }
};
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json(failureResponse({ error: "Please enter all fields" }));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(failureResponse({ error: "Invalid email or password" }));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(failureResponse({ error: "Invalid email or password" }));
    }

    let role = user.role;

    const token = generateToken(user._id, user.email, role);
    return res
      .status(200)
      .json(successResponse({ token }, "User login successfully"));
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json(failureResponse({ error: "Internal Server Error" }));
  }
};
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json(failureResponse({ error: "Please provide an email" }));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(failureResponse({ error: "User not found with this email" }));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1000 * 60 * 5;

    if (user.otp && user.otpExpiry > Date.now()) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      from: "yourEmail@gmail.com",
      subject: "Your OTP Code",
      html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    });

    return res.status(200).json(successResponse({}, "OTP sent to email"));
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json(failureResponse({ error: "Internal Server Error" }));
  }
};
export const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    if (!otp) {
      return res
        .status(400)
        .json(failureResponse({ error: "OTP is required" }));
    }

    const user = await User.findOne({
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json(failureResponse({ error: "Invalid or expired OTP" }));
    }

    return res
      .status(200)
      .json(successResponse({ success: true }, "OTP verified successfully"));
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json(failureResponse({ error: "Internal Server Error" }));
  }
};
export const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword, otp } = req.body;

  try {
    if (!newPassword || !confirmPassword || !otp) {
      return res.status(400).json(
        failureResponse({
          error: "New password, confirm password, and OTP are required",
        })
      );
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json(failureResponse({ error: "Passwords do not match" }));
    }

    const user = await User.findOne({
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json(failureResponse({ error: "Invalid or expired OTP" }));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res
      .status(200)
      .json(successResponse({}, "Password reset successfully"));
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json(failureResponse({ error: "Internal Server Error" }));
  }
};
export const AdminSignup = async (req, res) => {
  const { name, email, password, adminSecret } = req.body;

  try {
    if (!name || !email || !password || !adminSecret) {
      return res
        .status(400)
        .json(failureResponse({ error: "All fields are required" }));
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res
        .status(403)
        .json(failureResponse({ error: "Invalid admin secret" }));
    }

    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json(failureResponse({ error: "Admin already exists" }));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await user.save();

    res.status(200).json(successResponse({}, "Admin registered successfully"));
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json(failureResponse({ error: "Internal Server Error" }));
  }
};
export const AdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json(failureResponse({ error: "Please enter all fields" }));
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json(failureResponse({ error: "Unauthorized access" }));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(failureResponse({ error: "Invalid email or password" }));
    }

    let role = user.role;

    const token = generateToken(user._id, user.email, role);

    return res
      .status(200)
      .json(successResponse({ token }, "Admin login successful"));
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json(failureResponse({ error: "Internal Server Error" }));
  }
};
export const getUserOrders = async (req,res) => {
  try {
    const userId = req.user?.userId;
    if(!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const orders = await CardPurchase.find({userId: userId}).populate('cardPackId');
    if (!orders) {
      return res.status(404).json({ message: 'No orders found' });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateUserDetails = async (req,res) =>{
  try{
    const {email, postalcode, address, country} = req.body
    const userId = req.user?.userId;
    if(!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedUser = {}
    if(email){
      updatedUser.email = email
    }
    if(postalcode){
      updatedUser.postalcode = postalcode
    }
    if(address){
      updatedUser.address = address
    }
    if(country){
      updatedUser.country = country
    }

    const updateUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    return res.status(201).json({data: updateUser})


  }
  catch(error){
    console.log(error);
    return res.status(500).json({message: 'Internal Server Error'})
    
  }
}
