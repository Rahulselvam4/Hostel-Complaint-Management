import mongoose from 'mongoose';
import { buildTrieFromDB } from '../services/autocompleteServices.js';
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/HCMSD").then(async () => {
      console.log("Mongo connected");
      await buildTrieFromDB();
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;