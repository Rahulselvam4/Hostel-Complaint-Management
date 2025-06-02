// rateLimiter.js
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../utils/redis.js';

const rateLimiterMiddleware = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per IP in 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
  console.warn(`Rate limit exceeded for IP: ${req.ip}`);
  res.status(options.statusCode).json(options.message);
}

});

export default rateLimiterMiddleware;
