import dbConnect from '@/lib/dbConnect';
import { StaffMember } from '@/types/staffTypes';
import { createResponse } from '@/utils/helperFunctions';
import StaffModel from '@/models/staffModel';
import bcrypt from 'bcryptjs';
/**
 * this will create a new staff member
 * @param req incoming http request
 * @returns success or failure response
 */
const validateClientData = (data: Partial<StaffMember>) => {
  const { name, email, password, role } = data;
  if (!name || !email || !password || !role) {
    return 'All fields (name, email, password, and role) are required.';
  }
  return null;
};
export async function POST(req: Request) {
  await dbConnect();
  try {
    const adminId = new URL(req.url).searchParams.get('id');

    const admin = await StaffModel.findOne({
      _id: adminId,
      role: { $in: ['admin', 'superadmin'] },
    }).lean();
    if (!admin) {
      return createResponse(401, false, 'Unauthorized access.');
    }
    const staffMemberData: Partial<StaffMember> = await req.json();
    const validationError = validateClientData(staffMemberData);
    if (validationError) {
      return createResponse(400, false, validationError);
    }
    const existingStaffMember = await StaffModel.findOne({
      $or: [
        { email: staffMemberData.email },
        { contactNumber: staffMemberData.contactNumber },
      ],
    });
    if (existingStaffMember) {
      return createResponse(
        400,
        false,
        'Staff member with this email or contact number already exists.'
      );
    }

    // checking the roles
    if (admin.role === 'admin' || admin.role === 'superadmin') {
      // only superadmin can update role of admin
      if (
        admin.role === 'admin' &&
        (staffMemberData.role === 'superadmin' ||
          staffMemberData.role === 'admin')
      ) {
        return createResponse(401, false, 'Unauthorized access.');
      }
    }
    const bcryptedPassword = await bcrypt.hash(
      staffMemberData?.password as string,
      10
    );
    staffMemberData.password = bcryptedPassword;
    const newStaffMember = await StaffModel.create(staffMemberData);
    if (!newStaffMember) {
      return createResponse(400, false, 'Invalid data. Please try again.');
    }
    return createResponse(200, true, 'Staff member created successfully.');
  } catch (error) {
    console.error('Error creating staff member:', error);
    return createResponse(
      500,
      false,
      'An unexpected error occurred. Please try again later.'
    );
  }
}
