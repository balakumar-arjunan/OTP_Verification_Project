const jwt = require("jsonwebtoken");

// Middleware for Authentication
module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log("Received Token:", token); // Debugging log

    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
