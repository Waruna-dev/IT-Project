import ExchangeRequest from "../models/exchangeRequestModel.js";
import RefundRequest from "../models/refundRequestModel.js";
import orderModel from "../models/orderModel.js";
import jwt from 'jsonwebtoken';

// Controller for submitting an exchange request
const submitExchangeRequest = async (req, res) => {
    try {
        const {
            reason,
            quantity,
            preferredReplacement,
            phone,
            email,
            address,
            exchangeMethod,
            pickupDateTime,
            product
        } = req.body;

        // ADDED VALIDATION 1: Check for required fields
        if (!reason || !quantity || !phone || !email || !address || !exchangeMethod || !product) {
            return res.json({ success: false, message: "Missing required fields." });
        }

        // ADDED VALIDATION 2: Token and User ID validation
        const token = req.headers.token;
        if (!token) {
            return res.json({ success: false, message: "Authentication failed. Token is missing." });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const userId = token_decode.id;

        // ADDED VALIDATION 3: Data type and value validation
        if (isNaN(quantity) || quantity <= 0) {
            return res.json({ success: false, message: "Quantity must be a positive number." });
        }

        const newExchangeRequest = new ExchangeRequest({
            userId,
            orderItem: product,
            reason,
            quantity,
            preferredReplacement,
            phone,
            email,
            address,
            exchangeMethod,
            pickupDateTime
        });

        await newExchangeRequest.save();
        res.json({ success: true, message: "Exchange request submitted successfully!" });

    } catch (error) {
        console.error("Error submitting exchange request:", error);
        res.json({ success: false, message: "Failed to submit exchange request." });
    }
};

// Controller for submitting a refund request
const submitRefundRequest = async (req, res) => {
    try {
        const {
            reason,
            phone,
            email,
            address,
            quantity,
            refundMethod,
            product
        } = req.body;

        // ADDED VALIDATION 1: Check for required fields
        if (!reason || !phone || !email || !address || !quantity || !refundMethod || !product) {
            return res.json({ success: false, message: "Missing required fields." });
        }

        // ADDED VALIDATION 2: Token and User ID validation
        const token = req.headers.token;
        if (!token) {
            return res.json({ success: false, message: "Authentication failed. Token is missing." });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const userId = token_decode.id;

        // ADDED VALIDATION 3: Data type and value validation
        if (isNaN(quantity) || quantity <= 0) {
            return res.json({ success: false, message: "Quantity must be a positive number." });
        }

        const newRefundRequest = new RefundRequest({
            userId,
            orderItem: product,
            reason,
            phone,
            email,
            address,
            quantity,
            refundMethod
        });

        await newRefundRequest.save();
        res.json({ success: true, message: "Refund request submitted successfully!" });

    } catch (error) {
        console.error("Error submitting refund request:", error);
        res.json({ success: false, message: "Failed to submit refund request." });
    }
};

// Controller for listing all exchange requests
const listExchangeRequests = async (req, res) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Token is missing' });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const userId = token_decode.id;

        const exchangeRequests = await ExchangeRequest.find({});
        res.json({ success: true, data: exchangeRequests });
    } catch (error) {
        console.error("Error listing exchange requests:", error);
        res.json({ success: false, message: "Failed to fetch exchange requests." });
    }
};

const listRefundRequests = async (req, res) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Token is missing' });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const userId = token_decode.id;

        const refundRequests = await RefundRequest.find({});
        res.json({ success: true, data: refundRequests });
    } catch (error) {
        console.error("Error listing refund requests:", error);
        res.json({ success: false, message: "Failed to fetch refund requests." });
    }
};

// Function to remove an exchange request
const removeExchangeRequest = async (req, res) => {
    try {
        const { id } = req.body;
        // ADDED VALIDATION 4: ID existence check
        if (!id) {
            return res.json({ success: false, message: "Missing request ID." });
        }

        const deletedRequest = await ExchangeRequest.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.json({ success: false, message: "Exchange request not found." });
        }

        res.json({ success: true, message: "Exchange request removed successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to remove exchange request" });
    }
};

// Function to remove a refund request
const removeRefundRequest = async (req, res) => {
    try {
        const { id } = req.body;
        // ADDED VALIDATION 4: ID existence check
        if (!id) {
            return res.json({ success: false, message: "Missing request ID." });
        }

        const deletedRequest = await RefundRequest.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.json({ success: false, message: "Refund request not found." });
        }

        res.json({ success: true, message: "Refund request removed successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to remove refund request" });
    }
};


export {
    submitExchangeRequest,
    submitRefundRequest,
    listExchangeRequests,
    listRefundRequests,
    removeExchangeRequest,
    removeRefundRequest
};