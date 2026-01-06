const FavouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  contentType: {
    type: String,
    enum: ["movie", "episode"],
    required: true
  }
});