import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

/**
 * Middleware to catch validation errors and pass them to the error handler
 */
export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    // Catch validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const data = { errors: errors.array() };
      throw createHttpError(400, {
        message: "Validation error!",
        data,
      });
    }

    // Forward to next middleware if no validation errors
    next();
  }
);


/**
 * Error handler middleware to catch errors not handled by catchError middleware.
 * 
 * Handles errors in the following way:
 * - If the error is an HTTP error (instance of createHttpError.HttpError), it returns the error status and message,
 *   along with any error data.
 * - If the error is not an HTTP error, it logs the error and returns a generic 500 Internal Server Error response
 *   with a message and no data.
 * 
 * @param err - The error to be handled.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Custom logic to handle errors not handled by catchError
  if (err instanceof createHttpError.HttpError) {
    return res.status(err.status).json({
      message: err.message,
      data: err.data || null,
    });
  }

  // If the error is not an HTTP error, pass it as a generic internal error
  console.error(err);  // Optionally log the error for debugging
  return res.status(500).json({
    message: "Internal server error",
    data: null,
  });
};
