import { ErrorRequestHandler } from "express";
import { ZodError } from "zod/v4";
import { RequestWithData } from "../types";
import { HttpError } from "../utils/httpError";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const isLoggedIn = Boolean((req as RequestWithData).user);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: error.issues.map((issue) => issue.message).join("\n"),
      isLoggedIn,
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      isLoggedIn,
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    success: false,
    message: "Server Error",
    isLoggedIn,
  });
};