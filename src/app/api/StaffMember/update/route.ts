import dbConnect from '@/lib/dbConnect';
import StaffModel from '@/models/staffModel';
import { StaffMember } from '@/types/staffTypes';
import { createResponse } from '@/utils/helperFunctions';

/**
 * Updates a staff member's details.
 *
 * @param req HTTP incoming request
 * @returns Response object with update status
 */
export async function PATCH(req: Request) {
  await dbConnect();

  try {
    // Parse URL parameters
    const url = new URL(req.url);
    const staffMemberId = url.searchParams.get('id');
    const adminId = url.searchParams.get('adminId');

    if (!staffMemberId)
      return createResponse(400, false, 'Staff ID is required.');
    if (!adminId) return createResponse(400, false, 'Admin ID is required.');

    // Fetch staff member and validate existence
    const staffMember = await StaffModel.findById(staffMemberId);
    if (!staffMember)
      return createResponse(404, false, 'Staff member not found.');

    // Extract and validate payload
    const { name, email, contactNumber, role }: Partial<StaffMember> =
      await req.json();
    if (!name && !email && !contactNumber && !role) {
      return createResponse(
        400,
        false,
        'At least one field must be provided for update.'
      );
    }

    // Validate email for duplicates
    if (email && (await isDuplicateField('email', email, staffMemberId))) {
      return createResponse(
        400,
        false,
        'Staff member with this email already exists.'
      );
    }

    // Validate contact number for duplicates
    if (
      contactNumber &&
      (await isDuplicateField('contactNumber', contactNumber, staffMemberId))
    ) {
      return createResponse(
        400,
        false,
        'Staff member with this contact number already exists.'
      );
    }

    // Update staff member details
    if (name) staffMember.name = name;
    if (email) staffMember.email = email;
    if (contactNumber) staffMember.contactNumber = contactNumber;

    // Handle role update
    if (role) {
      const admin = await StaffModel.findById(adminId).select('role');
      if (!admin) return createResponse(404, false, 'Admin not found.');
      if (adminId === staffMemberId) {
        return createResponse(401, false, 'You cannot update your own role.');
      }
      if (!canUpdateRole(admin.role, staffMember.role, role)) {
        return createResponse(403, false, 'Unauthorized role update.');
      }
      staffMember.role = role;
    }

    await staffMember.save();
    return createResponse(200, true, 'Staff member updated successfully.');
  } catch (error) {
    console.error('Error updating staff member:', error);
    return createResponse(500, false, 'An unexpected error occurred.');
  }
}

/**
 * Checks if a field value is duplicate for another staff member.
 *
 * @param field Field name to check
 * @param value Value of the field
 * @param currentId ID of the current staff member
 * @returns True if duplicate exists, false otherwise
 */
async function isDuplicateField(
  field: string,
  value: string,
  currentId: string
): Promise<boolean> {
  const existing = await StaffModel.findOne({ [field]: value });
  return existing ? existing._id.toString() !== currentId : false;
}

/**
 * Determines if a role update is authorized based on admin and staff roles.
 *
 * @param adminRole Role of the admin
 * @param currentRole Current role of the staff member
 * @param newRole New role to assign
 * @returns True if authorized, false otherwise
 */
function canUpdateRole(
  adminRole: string,
  currentRole: string,
  newRole: string
): boolean {
  if (adminRole === 'superadmin') return true; // Superadmin can update any role
  if (adminRole === 'admin' && currentRole === 'staffmember') return true; // Admin can update non-admin roles
  return false; // Unauthorized otherwise
}
