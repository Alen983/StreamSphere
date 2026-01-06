const mongoose = require("mongoose");
const { Schema } = mongoose;

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
