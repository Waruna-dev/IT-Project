// backend/controllers/feedbackController.js
import feedbackModel from '../models/feedbackModel.js';

// Function to handle feedback submission
const submitFeedback = async (req, res) => {
  try {
    const { orderId, productId, feedback } = req.body;
    const userId = req.userId; // `req.userId` is set by your auth middleware

    if (!orderId || !productId || !feedback) {
      return res.json({ success: false, message: "Missing required feedback data." });
    }

    // Create a new feedback document
    const newFeedback = new feedbackModel({
      userId,
      orderId,
      productId,
      rating: feedback.rating,
      deliveryExperience: feedback.deliveryExperience,
      productQuality: feedback.productQuality,
      comments: feedback.comments,
    });

    await newFeedback.save();

    res.json({ success: true, message: "Feedback submitted successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error submitting feedback" });
  }
};

export { submitFeedback };