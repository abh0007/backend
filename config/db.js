import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://abhigangwarlife:p5atkVSuHxbQsxcT@siafoods.4ecoa.mongodb.net/food-del"
    );
    console.log("DB Connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); // Exit the process if DB fails to connect
  }
};
