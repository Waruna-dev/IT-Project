import mongoose from "mongoose";

const exchangeRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    orderItem: { // Details of the product being exchanged
        type: Object,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    preferredReplacement: {
        type: String
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
    exchangeMethod: {
        type: String,
        required: true
    },
    pickupDateTime: {
        type: String, // Stored as a string to match the frontend input
    },
    /*status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Rejected'],
        default: 'Pending'
    },*/
}, { timestamps: true });

const ExchangeRequest = mongoose.model("ExchangeRequest", exchangeRequestSchema);
export default ExchangeRequest;