import express from "express";
import { createPayment, getReceipt } from "../controllers/paymentController.js";
import authUser from "../middleware/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create", authUser, createPayment);
paymentRouter.get("/receipt/:transactionId", authUser, getReceipt);

export default paymentRouter;
