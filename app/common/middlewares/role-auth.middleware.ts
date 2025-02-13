import { Request, Response, NextFunction } from "express";


/**
 * A middleware function to check if the logged-in user has a specific role before allowing to access a route.
 * @param roles - An array of allowed roles.
 * @returns {Function} A middleware function that checks the user's role and prevents access if the role is not in the allowed roles.
 */
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role; // Assuming user role is attached to the `req.user` object

    // Check if the user's role is in the allowed roles
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
    next(); // If the role matches, proceed to the next middleware or route handler
  };
};
