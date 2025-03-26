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

export const User = models.User || model<IUser>('User', userSchema);