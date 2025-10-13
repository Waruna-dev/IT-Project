import mongoose from "mongoose";

const refundRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    orderItem: { // Details of the product being refunded
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
    /*status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Rejected'],
        default: 'Pending'
    },*/
}, { timestamps: true });

const RefundRequest = mongoose.model("RefundRequest", refundRequestSchema);
export default RefundRequest;