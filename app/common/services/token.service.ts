import prisma from "../services/database.service";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";



/**
 * Generates a new access token for the given user ID.
 *
 * @param userId - The ID of the user to generate a new access token for.
 * @returns The new access token.
 */
const generateAccessToken = (userId: string): string => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
  return accessToken;
};



/**
 * Generates a refresh token for the given user ID.
 *
 * This function creates a JWT refresh token using the user's ID, 
 * signing it with the refresh secret from environment variables, 
 * and setting an expiration time of 7 days.
 *
 * @param userId - The ID of the user to generate a refresh token for.
 * @returns The generated refresh token.
 */
const generateRefreshToken = (userId: string): string => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  return refreshToken;
};



/**
 * Clears all tokens associated with the given user ID from the response cookies
 * and from the database.
 * 
 * @param userId - The user ID to clear tokens for.
 * @param res - The response object used to clear tokens from.
 * @returns A Promise that resolves when the tokens have been cleared.
 */
export const clearTokens = async (userId: string, res: Response) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,  // Clear the stored refresh token
    } as Prisma.UserUpdateInput,
  });

  res.clearCookie("access_token");  // Clear the access token cookie
  res.clearCookie("refresh_token"); // Clear the refresh token cookie
};



/**
 * Generates both an access token and a refresh token for the given user ID,
 * updates the user's record with the new refresh token, and sets the tokens
 * in the response cookies.
 * 
 * @param userId - The ID of the user to generate tokens for.
 * @param res - The response object used to set the tokens in.
 * @returns A Promise that resolves when the tokens have been generated and set.
 */
export const generateTokens = async (userId: string, res: Response) => {
  const refreshToken = generateRefreshToken(userId); // Generate refresh token
  const accessToken = generateAccessToken(userId);   // Generate access token

  // Update the user with the new refresh token
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken, // Store the refresh token in the user's record
    } as Prisma.UserUpdateInput,
  });

  // Set the tokens in the response cookies
  setTokensInResponse(res, accessToken, refreshToken);
};



/**
 * Sets the access token and refresh token in the response cookies.
 * 
 * @param res - The response object to set the tokens in.
 * @param accessToken - The access token to set.
 * @param refreshToken - The refresh token to set.
 */
const setTokensInResponse = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("access_token", accessToken, {
    httpOnly: true, // Makes the cookie accessible only by the web server
    secure: process.env.NODE_ENV === "development", // Set secure flag for development
    sameSite: "strict",  // Protects against CSRF attacks
    maxAge: 15 * 60 * 1000, // Access token expires in 15 minutes
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // Refresh token expires in 7 days
  });
};




/**
 * Verifies the given access token and returns the associated user ID if valid,
 * or null if invalid.
 * 
 * @param token - The access token to verify.
 * @returns The user ID associated with the token, or null if invalid.
 */
export const verifyAccessToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    return decoded?.userId || null; // Assuming 'id' is the field you are storing in the JWT payload
  } catch (error) {
    return null;
  }
};



/**
 * Verifies the given refresh token using the secret key from environment variables.
 * Returns the decoded token if verification is successful, or null if failed.
 *
 * @param token - The refresh token to verify.
 * @returns The decoded token if valid, or null if invalid.
 */
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  } catch (error) {
    return null;  // If verification fails, return null
  }
};


/**
 * Generates a new access token for the given refresh token and sets it in the response.
 * If the refresh token is invalid, returns null.
 * 
 * @param refreshToken - The refresh token to generate a new access token for.
 * @param res - The response object to set the new access token in.
 * @returns The new access token, or null if the refresh token is invalid.
 */
export const refreshAccessToken = async (refreshToken: string, res: Response) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return null;  // Invalid refresh token
  }

  const userId = (decoded as any).userId; // Extract user ID from the decoded refresh token
  const newAccessToken = generateAccessToken(userId); // Generate a new access token
  res.cookie("access_token", newAccessToken, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "development", 
    sameSite: "strict", 
    maxAge: 15 * 60 * 1000,  // New access token expires in 15 minutes
  });

  return newAccessToken;
};
