import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import mainRouter from "./router"
import { env_variables } from "../config/environment";
import { showRequest } from "../middlewares/showRequest";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env_variables.FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PATCH"],
  })
);
app.use(cookieParser());
app.use(showRequest);
app.use("/api", mainRouter)
app.use((_req,res)=>{
  res.status(404).send("Undefined path.")
})

export const InitServer = async () => {
  app.listen(env_variables.PORT, ()=> console.log("Server up, listening at port: ",env_variables.PORT))
};