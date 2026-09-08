import { NextFunction, Response } from "express";
import { env_variables as envs } from "../config/environment";
import { verifyToken } from "../utils/jwt";
import { IUser } from "../entities/user/schema";
import { RequestWithData } from "../types";

export const authenticate = (
  req: RequestWithData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[envs.TOKEN_NAME];
    req.user = undefined;

    if (token) {
      const userData = verifyToken(token);
      if (userData)
        req.user = userData as Pick<IUser, "username" | "id" | "email">;
      else res.clearCookie(envs.TOKEN_NAME);
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};
