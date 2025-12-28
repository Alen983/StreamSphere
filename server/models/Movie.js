const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: { type: String },
  genre: { type: [String] },
  language: { type: String },
  duration: { type: Number },
  tags: { type: [String] },
  release_date: {type: Date},
  poster_url: { type: String },
  thumbnail_url: { type: String },
  trailer_url: { type: String },
  movie_url: { type: String }

});

mongoose.model("movies", movieSchema);