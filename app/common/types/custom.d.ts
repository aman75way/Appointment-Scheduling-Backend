declare namespace Express {
    export interface Request {
      userId: string;  // Add other custom properties if needed
      role: "USER" | "STAFF" | "ADMIN";  // Role types can be extended based on your actual roles
    }
  }
  