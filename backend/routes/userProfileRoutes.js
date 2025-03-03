const router = require("express").Router();

const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");

const User = require("../models/userModel.js");
const transporter = require("../utils/nodemailer.js");

const generateOTP = require("../utils/helper.js");
const upload = require("../middlewares/uploadMiddleware.js");

// Register - Step 1 (Send OTP)
router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    console.log(`Generating OTP for ${email}: ${otp}`);

    let user = await User.findOne({ email });

    if (!user) user = new User({ email, otp, otpExpires });
    else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();
    console.log(`OTP saved in DB for ${email}`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Sending Error:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
      console.log(`Email sent to ${email}:`, info.response);
      res.json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify OTP - Step 2
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({
      message: "OTP verified",
      token: jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" }),
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Complete Profile - Step 3
router.post("/complete-profile", upload.single("photo"), async (req, res) => {
  try {
    console.log("Received complete-profile request:", req.body);
    const { email, weight, height, medicalHistory } = req.body;
    const photo = req.file ? req.file.filename : null;

    await User.findOneAndUpdate(
      { email },
      { weight, height, medicalHistory, photo }
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Complete-profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Home API - Returns YouTube URL (Protected)
router.get("/home", authMiddleware, (req, res) => {
  try {
    res.json({ youtubeUrl: "https://www.youtube.com/watch?v=enYITYwvPAQ" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
