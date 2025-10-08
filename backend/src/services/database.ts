import mongoose from "mongoose";
import { env_variables } from "../config/environment";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env_variables.MONGO_URI!);
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
