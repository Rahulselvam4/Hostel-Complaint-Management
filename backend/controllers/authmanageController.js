import Otp from "../models/Otp.js";
import Student from "../models/Student.js";
import Worker from "../models/Worker.js";
import Admin from "../models/Admin.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ========== 1. Forgot Password ========== //
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await Otp.create({ email, otp, expiresAt });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// ========== 2. Verify OTP ========== //
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== 3. Reset Password ========== //
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Student.findOneAndUpdate({ email }, { password: hashedPassword });

    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== 4. Google Login ========== //
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      user = await Worker.findOne({ email });
      if (user) {
        role = "worker";
      } else {
        user = await Admin.findOne({ email });
        if (user) {
          role = "admin";
        }
      }
    }

    // If user doesn't exist in any collection, register them as a student
    if (!user) {
      user = await Student.create({
        email,
        name,
        photo: picture,
        role: "student", // default role
      });
      role = "student";
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user, role });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(400).json({ message: "Google login failed" });
  }
};
