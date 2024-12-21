import { StaffMember } from '@/types/staffTypes';
import mongoose, { Schema, model, models } from 'mongoose';

const staffSchema = new Schema<StaffMember>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },

    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['staffmember', 'admin', 'superadmin'],
    },
    dateOfJoining: {
      type: Date,
      required: true,
      default: Date.now,
    },
    address: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    lastLogin: {
      type: Date,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const StaffModel =
  (models.Staff as mongoose.Model<StaffMember>) ||
  model<StaffMember>('Staff', staffSchema);

export default StaffModel;
