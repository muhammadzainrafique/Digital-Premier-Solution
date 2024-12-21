import dbConnect from '@/lib/dbConnect';
import StaffModel from '@/models/staffModel';
import { createResponse } from '@/utils/helperFunctions';

export async function GET(req: Request) {
  await dbConnect();
  try {
    const staffMemberId = new URL(req.url).searchParams.get('id');
    const staffMember = await StaffModel.findById(staffMemberId).select(
      '-password -__v -createdAt -updatedAt'
    );
    if (!staffMember) {
      return createResponse(404, false, 'Profile not found');
    }
    return createResponse(200, true, staffMember);
  } catch (error) {
    console.error('Error creating staff member:', error);
    return createResponse(
      500,
      false,
      'An unexpected error occurred. Please try again later.'
    );
  }
}
