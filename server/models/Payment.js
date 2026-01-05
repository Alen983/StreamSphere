const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    amount: { type: Number },
    orderId: { type: String },
    paymentId: { type: String },
    signature: { type: String },
    status: { type: String, default: "PENDING" }, // PENDING, SUCCESS, FAILED
  },
  { timestamps: true }
);

mongoose.model("payments", paymentSchema);
