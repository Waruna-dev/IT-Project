// routes/paymentRoutes.js
import express from "express";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/process", async (req, res) => {
  try {
    const { userId, amount, method } = req.body;

    const doc = new PDFDocument();
    const filePath = path.resolve(`./receipts/receipt_${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(22).text("Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`User ID: ${userId}`);
    doc.text(`Amount: $${amount}`);
    doc.text(`Payment Method: ${method}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.text(`Status: SUCCESS ✅`);
    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, "Payment_Receipt.pdf", (err) => {
        if (err) console.error(err);
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment processing failed" });
  }
});

export default router;
