import { Response, NextFunction } from "express";
import { RequestWithData } from "../types";

export const showRequest = (
  req: RequestWithData,
  _res: Response,
  next: NextFunction
) => {
  console.log(`
New Request
from: ${req.headers.origin}
endpoint: ${req.url}
method: ${req.method}
username:${req.user?.username}`);
  if (req.body) console.log(JSON.stringify({ body: req.body }, null, 2));
  next();
};
