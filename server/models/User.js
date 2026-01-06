//v2 added pref and fav genres
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {type: String},
  email: { type: String,
   required: true,
   unique: true },
  phone: { type: String },
  otp: { type: String },
  subscriptionType: { type: String }, //basic / premium
  preferences: {
    favoriteGenres: [{
      type: Schema.Types.ObjectId,
      ref: "genres"
    }],
    favoriteMedia: [{
      type: Schema.Types.ObjectId,
      ref: "Media"
    }]
  }
});

mongoose.model("users", userSchema);
//old code
// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const userSchema = new Schema({
//   name: {type: String},
//   email: { type: String,
//    required: true,
//    unique: true },
//   phone: { type: String },
//   otp: { type: String },
//   subscriptionType: { type: String },
//   preferences: {
//       favoriteGenres: [
//         {
//           type: String,
//           trim: true,
//         },
//       ],}
// });

// mongoose.model("users", userSchema);