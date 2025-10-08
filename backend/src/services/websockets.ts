import { Server, Socket } from "socket.io";
import http from "node:http";
import { env_variables } from "../config/environment";
import { app } from "./expressServer";

const httpServer = http.createServer(app);

const io = new Server(httpServer, { cors: { origin: env_variables.FRONTEND } });

export const setWebSockets = () => {
  io.on("connection", (socket: Socket) => {
    console.log("new User connected to websockets, " + socket.id);
  });
};
