import express from 'express';
import { studentSignup, login } from '../controllers/authController.js';
import rateLimiterMiddleware from '../middleware/rateLimiterMiddleware.js';
const router = express.Router();

router.post('/signup', studentSignup); // Only for students
router.post('/signin', rateLimiterMiddleware , login);         // For students and workers

export default router;
