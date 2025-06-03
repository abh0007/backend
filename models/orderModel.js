import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },

  // ❌ REMOVE the delivery address (no longer needed for pickup)
  // address: { type: Object, required: true },

  // ✅ ADD these fields
  pickupDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },

  paymentMethod: { type: String, enum: ["Pay at Counter", "Online"], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },

  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
