import mongoose from "mongoose";

const refundRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  paymentId: { //  NEW FIELD — connect refund to its payment
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: false
  },
  orderItem: {
    type: Object,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  refundMethod: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });

const RefundRequest = mongoose.model("RefundRequest", refundRequestSchema);
export default RefundRequest;
