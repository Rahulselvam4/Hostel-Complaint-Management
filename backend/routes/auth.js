import express from "express";
import {
  forgotPassword,
  resetPassword,
  googleLogin,
  verifyOtp
} from "../controllers/authmanageController.js";

const authRouter = express.Router();

// Forgot Password Route
authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/verify-otp", verifyOtp);

// Reset Password Route
authRouter.post("/reset-password", resetPassword);

// Google Login Route
authRouter.post("/google-login", googleLogin);

export default authRouter;
