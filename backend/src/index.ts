import { connectDB } from "./services/database";
import { InitServer } from "./services/server";
import { setWebSockets } from "./services/websockets";

(async () => {
  try {
    console.clear();
    await connectDB();
    InitServer();
    setWebSockets();
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
