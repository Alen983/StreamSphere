const mongoose = require("mongoose");
const { Schema } = mongoose;

<<<<<<< HEAD
const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
genreSchema.index({ name: 1 });

const Genre = mongoose.model("Genre", genreSchema);

module.exports = { Genre };
=======
const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
});

mongoose.model("genres", genreSchema);

// db.genres.insertMany([
//   { name: "Action" },
//   { name: "Adventure" },
//   { name: "Comedy" },
//   { name: "Drama" },
//   { name: "Thriller" },
//   { name: "Horror" },
//   { name: "Romance" },
//   { name: "Science Fiction" },
//   { name: "Fantasy" },
//   { name: "Mystery" },
//   { name: "Crime" },
//   { name: "Animation" },
//   { name: "Family" },
//   { name: "Documentary" }
// ]);
>>>>>>> 1fde14aad6ff56e71d489817d820afb432943467
