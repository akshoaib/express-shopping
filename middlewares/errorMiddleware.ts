import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Default
  let statusCode = 500;
  let message = "Server Error";

  // If it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // If it's a normal Error
  if (err instanceof Error && !(err instanceof AppError)) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
