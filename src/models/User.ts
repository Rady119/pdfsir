import mongoose from 'mongoose';
import { Schema, model, models } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  subscription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  subscription: {
    type: String,
    default: 'free',
  },
}, {
  timestamps: true,
});

// Prevent multiple model initialization during hot reloading
let UserModel: mongoose.Model<IUser>;
try {
  UserModel = mongoose.model<IUser>('User');
} catch {
  UserModel = mongoose.model<IUser>('User', userSchema);
}

export const User = UserModel;