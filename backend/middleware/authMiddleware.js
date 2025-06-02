import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Worker from '../models/Worker.js';
import Admin from '../models/Admin.js';
import { configDotenv } from 'dotenv';

configDotenv();
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_SECRET =  process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    let user =
      (await Student.findById(decoded.id).select('-password')) ||
      (await Worker.findById(decoded.id).select('-password')) ||
      (await Admin.findById(decoded.id).select('-password'));

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
