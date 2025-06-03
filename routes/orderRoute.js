import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// Admin: List all orders
orderRouter.get("/list", listOrders);

// User: View own orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// User: Place order (Pay at Counter or Online via PhonePe)
orderRouter.post("/place", authMiddleware, placeOrder);

// Admin: Update order status
orderRouter.post("/status", updateStatus);

// Payment verification (PhonePe success/failure callback)
orderRouter.post("/verify", verifyOrder);

export default orderRouter;
