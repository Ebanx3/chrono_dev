import http from "node:http";
import { app } from "./expressServer";

export const httpServer = http.createServer(app);
