const nodemailer = require("nodemailer");

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

module.exports = transporter;
