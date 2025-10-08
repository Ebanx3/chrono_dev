import { Server, Socket } from "socket.io";
import { httpServer } from "./httpServer";
import { env_variables } from "../config/environment";

const io = new Server(httpServer, {cors:{origin: env_variables.FRONTEND}});

io.on('connection', (socket:Socket)=>{
    console.log('new User connected to websockets, '+ socket.id);
});