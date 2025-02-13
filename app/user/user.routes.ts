import { Router } from "express";
import { login, logout, signup, getUser } from "./user.controller";
import loginRequireMiddlware from "../common/middlewares/auth.middleware";
import { catchError } from "../common/helper/catch-error.helper";
import { validateUserSignup } from "./user.validation"; 
import loginLimiter from "../common/services/rate-limiter.service";

const router = Router();

// User authentication routes
router.post("/login", loginLimiter, catchError, login);  // Login a user
router.post("/signup", validateUserSignup, catchError, signup);  // Register a new user
router.post("/logout", loginRequireMiddlware, catchError, logout);  // Log out the user (authentication required)
router.get("/", loginRequireMiddlware, catchError, getUser);  // Get the authenticated user's details (authentication required)

export default router;
 