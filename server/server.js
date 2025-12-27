const express = require("express"); // npm i express
const mongoose = require("mongoose"); // npm i mongoose
require("dotenv").config(); // Load environment variables. Make sure .env is in .gitignore

const port = process.env.PORT || 5001;

const app = express();
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
require("./models/Movie");
require("./models/User");

//Middle
require("./middleware/requireMail")


// Routes
require("./routes/movieRoutes")(app);
require("./routes/userRoutes")(app); // To Learn CRUD Oprations
require("./routes/authRoutes")(app);
require("./routes/streamRoutes")(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});