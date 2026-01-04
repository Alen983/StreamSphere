const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {type: String},
  email: { type: String,
   required: true,
   unique: true },
  phone: { type: String },
  otp: { type: String },
  subscriptionType: { type: String }
});

mongoose.model("users", userSchema);