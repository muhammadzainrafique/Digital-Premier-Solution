import { Client } from '@/types/clientTypes';
import mongoose, { Schema } from 'mongoose';
const clientSchema: Schema<Client> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  clientMessage: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  requiredService: {
    type: String,
    required: true,
  },
});

const clientModel =
  (mongoose.models.Client as mongoose.Model<Client>) ||
  mongoose.model<Client>('Client', clientSchema);

export default clientModel;
