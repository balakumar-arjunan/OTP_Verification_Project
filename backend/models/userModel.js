const mongoose = require("mongoose");

// ✅ User Schema
const UserSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    otp: String,
    otpExpires: Date,
    weight: String,
    height: String,
    medicalHistory: String,
    photo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
