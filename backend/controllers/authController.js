import Student from '../models/Student.js';
import Admin from '../models/Admin.js';
import Worker from '../models/Worker.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const studentSignup = async (req, res) => {
  const { name, email, password, mobile, registerNumber, hostelBlock, roomNumber } = req.body;
  console.log(name, email, password, mobile, registerNumber, hostelBlock, roomNumber);

  try {
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Student already exists' });

    const student = new Student({
      name,
      email,
      password,
      mobile,
      registerNumber,
      hostelBlock,
      roomNumber
    });

    await student.save();

    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ token, user: { id: student._id, name: student.name, role: 'student' } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;  

  try {
    // Look in Student model
    let user = await Student.findOne({
      $or: [{ email }, { mobile: email }]
    }).select('+password');
    let role = 'student';

    // If not found in students, look in workers
    if (!user) {
      user = await Worker.findOne({
        $or: [{ email }, { mobile: email }]
      }).select('+password');
      role = 'worker';
    }

    // If not found in workers, look in admins
    if (!user) {
      user = await Admin.findOne({
        $or: [{ email }, { mobile: email }]
      }).select('+password');
      role = 'admin';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        hostelBlock:user.hostelBlock,
        roomNumber:user.roomNumber,
        role,
        employeeNumber:user.employeeNumber,
        field:user.field,
        photo: user.photo
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
