import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: String,
  otpExpiry: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  country:{type: String},
  postalcode: {type: Number},
  address: {type: String}
});

const User = mongoose.models.User ||  mongoose.model('User', userSchema);
export default User