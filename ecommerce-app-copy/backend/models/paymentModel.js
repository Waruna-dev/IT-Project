import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["Card", "Gateway", "COD"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Completed"
  },
  transactionId: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: "LKR"
  }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
