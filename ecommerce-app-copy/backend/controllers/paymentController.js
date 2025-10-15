import Payment from "../models/paymentModel.js";
import jwt from "jsonwebtoken";

// Create new payment and receipt
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, transactionId } = req.body;

    // verify user
    const token = req.headers.token;
    if (!token) return res.json({ success: false, message: "Token missing" });

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = token_decode.id;

    const newPayment = new Payment({
      userId,
      orderId,
      amount,
      paymentMethod,
      transactionId,
    });

    await newPayment.save();
    res.json({ success: true, message: "Payment successful", data: newPayment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.json({ success: false, message: "Payment failed" });
  }
};

// Get receipt details by transaction ID
export const getReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const payment = await Payment.findOne({ transactionId }).populate("userId", "name email");
    if (!payment) return res.json({ success: false, message: "Receipt not found" });

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    res.json({ success: false, message: "Error fetching receipt" });
  }
};
