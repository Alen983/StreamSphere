const express = require("express"); // npm i express
const mongoose = require("mongoose"); // npm i mongoose
const cors = require("cors"); // npm i cors
require("dotenv").config(); // Load environment variables. Make sure .env is in .gitignore

const port = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Models
require("./models/Media");
require("./models/User");
require("./models/OTP");

// Routes
require("./routes/authRoutes")(app);
require("./routes/mediaRoutes")(app);
require("./routes/watchlistRoutes")(app);

// // Health check route
// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Media Streaming API",
//     version: "1.0.0",
//     endpoints: {
//       auth: "/api/auth/*",
//       media: "/api/media/*",
//       watchlist: "/api/watchlist",
//       watchHistory: "/api/watch-history",
//       continueWatching: "/api/continue-watching",
//     },
//   });
// });

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API available at http://localhost:${port}`);
});
