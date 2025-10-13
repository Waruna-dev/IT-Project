import express from "express";
import authUser from "../middleware/auth.js";
import feedbackModel from "../models/feedbackModel.js";

const router = express.Router();

// submit feedback
router.post("/submit", authUser, async (req, res) => {
  try {
    const { q1, q2, q3, q4, orderId } = req.body;

    const feedback = new feedbackModel({
      userId: req.body.userId,
      orderId,
      q1,
      q2,
      q3,
      q4
    });

    await feedback.save();

    res.json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default router;
