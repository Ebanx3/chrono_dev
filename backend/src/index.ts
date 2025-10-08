import { connectDB } from "./services/database";
import { InitServer } from "./services/expressServer";

(async () => {
  try {
    console.clear();
    await connectDB();
    InitServer();
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
