import { NextFunction, Response } from "express";
import { env_variables as envs } from "../config/environment";
import { verifyToken } from "../utils/jwt";
import { IUser } from "../entities/user/schema";
import { RequestWithData } from "../types";

const UnauthorizedJson = { success: false, message: "Unauthorized" };

export const authenticate = (
  req: RequestWithData,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies[envs.TOKEN_NAME];

    if (!token) {
       res.status(401).json(UnauthorizedJson);
       return
    }

    const userData = verifyToken(token);
    if (!userData) {
      res
        .clearCookie(envs.TOKEN_NAME)
        .status(401)
        .json(UnauthorizedJson);
       return
    }

    req.user = userData as Pick<IUser, 'username' | 'id' | 'email'>;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};
