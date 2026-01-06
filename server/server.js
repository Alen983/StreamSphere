const express = require("express"); // npm i express
const mongoose = require("mongoose"); // npm i mongoose
const cors = require("cors"); // npm i cors
require("dotenv").config(); // Load environment variables. Make sure .env is in .gitignore

const port = process.env.PORT || 5001;

const app = express();

// CORS Configuration - MUST be before other middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Models
require("./models/User");
require("./models/ContinueWatching");
require("./models/Media");
require("./models/Genre");
require("./models/Watchlist");

// Middleware
require("./middleware/requireMail");

// Routes
require("./routes/userRoutes")(app); // To Learn CRUD Operations
require("./routes/authRoutes")(app);
require("./routes/continueWatchingRoutes")(app);
require("./routes/genreRoutes")(app);
require("./routes/watchlistRoutes")(app);
require("./routes/mediaRoutes")(app);
require("./routes/searchRoutes")(app);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "StreamSphere API is running",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API available at http://localhost:${port}`);
});
