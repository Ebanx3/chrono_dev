import { connectDB } from "./services/database";
import { InitServer } from "./services/expressServer";
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
