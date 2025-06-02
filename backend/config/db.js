import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/HCMSD");
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;