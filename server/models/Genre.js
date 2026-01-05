const mongoose = require("mongoose");
const { Schema } = mongoose;

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
});

mongoose.model("genres", genreSchema);

// [
//   "Action",
//   "Adventure",
//   "Comedy",
//   "Drama",
//   "Thriller",
//   "Horror",
//   "Romance",
//   "Science Fiction",
//   "Fantasy",
//   "Mystery",
//   "Crime",
//   "Animation",
//   "Family",
//   "Documentary"
// ]