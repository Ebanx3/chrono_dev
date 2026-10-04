import { Request } from "express";
import { IProject } from "./entities/project/schema";

export type ServerResponse = {
  success: boolean;
  message: string;
  data?: any;
  isLoggedIn: boolean;
};

export interface RequestWithData<Body = any> extends Request<any, any, Body> {
  user?: Pick<IUser, "username" | "id" | "email">;
  cookies: { [key: string]: string };
}

type ActivityItemType = "discussion" | "vote" | "ticket";