import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { signupService, loginService, logoutService, getUserService } from "./user.service";
import { UserDTO } from "./user.dto";

// Signup Handler
export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Destructure request body
  const { fullName, email, role, password, confirmPassword } = req.body;

  // Call service to handle signup logic
  const newUser: UserDTO = await signupService(fullName, email, role, password, confirmPassword, res);

  // Respond with status and the newly created user
  res.status(201).json(newUser);
});

// Login Handler
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  // Call service to handle login logic
  const user: UserDTO = await loginService(email, password, res);

  // Respond with the logged-in user data (including token or user info)
  res.status(200).json(user);
});

// Logout Handler
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Call service to handle logout logic based on user ID
  const message = await logoutService(req.user.id, res);

  // Respond with success message
  res.status(200).json({ message });
});

// Get User Handler
export const getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Get user information by ID from the authenticated user
  const user: UserDTO = await getUserService(req.user.id);

  // Respond with the user information
  res.status(200).json(user);
});
