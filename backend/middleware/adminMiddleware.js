import Admin from "../models/Admin.js";

export const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
