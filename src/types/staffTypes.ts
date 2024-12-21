export type StaffRole = 'staffmember' | 'admin' | 'superadmin';
export interface StaffMember {
  name: string; 
  email: string; 
  password: string; 
  contactNumber: string; 
  role: StaffRole; 
  dateOfJoining: Date; 
  address?: string; 
  department?: string; 
  status: 'active' | 'inactive' | 'suspended'; 
  profilePicture?: string;
  lastLogin?: Date;
  createdAt: Date; 
  updatedAt?: Date; 
}
