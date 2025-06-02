import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String, required: true, select: false },
  mobile: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  },
  employeeNumber: { type: String, required: true, unique: true },
  photo: { type: String },
  field: {
    type: String,
    enum: ["Plumbing", "Electrical", "Carpentry", "Cleaning", "Other"],
    required: true
  }
}, { timestamps: true });

workerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
