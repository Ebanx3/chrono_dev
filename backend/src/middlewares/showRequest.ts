import { Request, Response, NextFunction } from "express";

export const showRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(`
New Request
from: ${req.headers.origin}
endpoint: ${req.url}
method: ${req.method}`);
  if (req.body) console.log(JSON.stringify({ body: req.body }, null, 2));
  next();
};
