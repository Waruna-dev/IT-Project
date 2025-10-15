import RefundRequest from '../models/refundRequestModel.js';
import Payment from '../models/paymentModel.js';

export const removeRefund = async (req, res) => {
  const { id } = req.body;

  try {
    const refund = await RefundRequest.findById(id);
    if (!refund) {
      return res.status(404).json({ success: false, message: "Refund not found" });
    }

    //  Find the related payment (if exists)
    if (refund.paymentId) {
      const payment = await Payment.findById(refund.paymentId);
      if (payment && payment.status !== "Refunded") {
        // Decrease the payment total or mark as refunded
        payment.status = "Refunded";
        payment.amount = 0; // or deduct specific refund amount
        await payment.save();
      }
    }

    //  Remove refund record
    await RefundRequest.findByIdAndDelete(id);

    res.json({ success: true, message: "Refund processed successfully" });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
