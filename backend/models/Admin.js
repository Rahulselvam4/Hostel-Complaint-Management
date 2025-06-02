import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
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
    required: true,
    validate: {
      validator: v => /^[0-9]{10}$/.test(v),
      message: props => `${props.value} is not a valid mobile number!`
    }
  }
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
