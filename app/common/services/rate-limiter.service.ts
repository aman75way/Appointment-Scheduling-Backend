import rateLimit from 'express-rate-limit';

// Rate limiting for login (limit 100 requests per 5 minutes)
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 minutes
  max: 100,
  message: 'Too many login attempts, please try again later.'
});

export default loginLimiter;