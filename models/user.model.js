import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['tenant', 'user'],
    default: 'user'
  },
  number:{
    type: String
  },
  companyName: {
    type: String
  },
  comapnySize: {
    type: String
  },
  comapnyAddress: {
    type: String
  },
  companyGST: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export const getUserModel = (connection) => connection.model('User', userSchema);
