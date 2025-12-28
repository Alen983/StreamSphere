const mongoose = require("mongoose");
const { Schema } = mongoose;

const seriesSchema = new Schema({
  title: String,
  genre: [String],
  language: String,
  tags: [String],
  release_date: Date,

  poster_url: String,
  thumbnail_url: String,
  trailer_url: String,
}); 

mongoose.model("series", seriesSchema);