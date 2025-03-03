require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userProfileRoutes = require("./routes/userProfileRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());

// Routes middleware
app.use("/api", userProfileRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Dynamic Port Handling (Auto Free Port)
const startServer = (port) => {
  const server = app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}`)
  );
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server Error:", err);
    }
  });
};

// Start Server with Auto Free Port Handling
startServer(process.env.PORT || 5000);
