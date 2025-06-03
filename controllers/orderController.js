import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place an Order (Pay at Counter or Online using PhonePe)
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, pickupDetails, paymentMethod } = req.body;

    if (!userId || !items || !amount || !pickupDetails || !paymentMethod) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      pickupDetails,
      paymentMethod,
      paymentStatus: paymentMethod === "Pay at Counter" ? "Pending" : "Initiated"
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // For PhonePe (online) payment, frontend should now call payment initiation
    if (paymentMethod === "Online") {
      return res.json({
        success: true,
        message: "Order created. Proceed with PhonePe payment.",
        orderId: newOrder._id
      });
    }

    // For Pay at Counter
    res.json({ success: true, message: "Order placed for pick-up at counter" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Order failed" });
  }
};

// List all Orders (Admin Panel)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving orders" });
  }
};

// List Orders of a Specific User
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving user orders" });
  }
};

// Update Order Status (Admin Panel)
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.json({ success: false, message: "Failed to update status" });
  }
};

// Verify Order After PhonePe Payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { paymentStatus: "Paid" });
      res.json({ success: true, message: "Payment confirmed" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed, order cancelled" });
    }
  } catch (error) {
    res.json({ success: false, message: "Verification failed" });
  }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder };
