import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Worker from './models/Worker.js';
import Admin from './models/Admin.js';
dotenv.config();
const MONGO_URI = 'mongodb://127.0.0.1:27017/HCMSD';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear old data
    await Worker.deleteMany({});
    await Admin.deleteMany({});

    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const workers = [
      {
        name: 'Ravi Kumar',
        email: 'babyrahul.47@gmail.com',
        password: hashedPassword,
        mobile: '9876543211',
        employeeNumber: 'EMP001',
        field: 'Electrical'
      },
      {
        name: 'Suresh Yadav',
        email: 'suresh.plumb@example.com',
        password: hashedPassword,
        mobile: '9876543212',
        employeeNumber: 'EMP002',
        field: 'Plumbing'
      },
      {
        name: 'Amit Verma',
        email: 'amit.carp@example.com',
        password: hashedPassword,
        mobile: '9876543213',
        employeeNumber: 'EMP003',
        field: 'Carpentry'
      },
      {
        name: 'Deepak Sharma',
        email: 'deepak.clean@example.com',
        password: hashedPassword,
        mobile: '9876543214',
        employeeNumber: 'EMP004',
        field: 'Cleaning'
      },
      {
        name: 'Vikram Mehta',
        email: 'vikram.other@example.com',
        password: hashedPassword,
        mobile: '9876543215',
        employeeNumber: 'EMP005',
        field: 'Other'
      }
    ];

    const admin = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '12345678',
      mobile: '9999999999'
    };

    // Insert data
    await Worker.insertMany(workers, { ordered: false });
    await Admin.insertOne(admin);

    console.log('Workers and Admin seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();
