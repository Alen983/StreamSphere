const mongoose = require("mongoose");
const { Schema } = mongoose;

const continueWatchingSchema = new Schema({
  userId: { type: String },
  movieId: { type: String },
  lastTime: { type: Number }
});

mongoose.model("continueWatching", continueWatchingSchema);


//const CWSchema = new Schema({ 
//  users_id: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   _id: {
//     type: Schema.Types.ObjectId,
//     ref: "",
//     required: true
//   },
// }); 