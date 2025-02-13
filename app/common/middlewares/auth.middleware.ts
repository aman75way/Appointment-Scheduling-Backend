import { Request, Response, NextFunction } from "express";
import prisma from "../services/database.service";
import { verifyAccessToken, refreshAccessToken } from "../services/token.service";
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        email: string;
        fullName: string;
        role: Role;
      };
    }
  }
}


/**
 * Middleware to protect routes by verifying the access token and refresh token
 * in the request's cookies. It retrieves the user with the corresponding id
 * from the database and stores it in the request object.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function in the middleware stack
 */
const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve tokens from cookies
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    // If neither token is provided, return unauthorized
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Unauthorized - No tokens provided" });
    }

    let userId: string | null = null;

    // Try to verify the access token first
    if (accessToken) {
      userId = verifyAccessToken(accessToken);
    }

    // If access token is invalid but refresh token exists, try to refresh the access token
    if (!userId && refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken, res);
      if (!newAccessToken) {
        return res.status(401).json({ error: "Unauthorized - Invalid tokens" });
      }
      userId = verifyAccessToken(newAccessToken);
    }

    // If still no valid userId after trying both tokens, return unauthorized
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - Invalid tokens" });
    }

    // Retrieve user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true },
    });

    // If user is not found, return not found error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
