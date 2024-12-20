export interface Client {
  name: string;
  email: string;
  contactNumber: string;
  requiredService: string;
  clientMessage?: string;
  title?: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}
