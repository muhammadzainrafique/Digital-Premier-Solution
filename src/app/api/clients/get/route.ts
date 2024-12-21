import dbConnect from '@/lib/dbConnect';
import clientModel from '@/models/clientModel';
import staffModel from '@/models/staffModel';
import { createResponse } from '@/utils/helperFunctions';

/**
 * Verifies if the provided admin ID belongs to a valid admin.
 * @param adminId - The ID of the admin to verify.
 * @returns True if the admin exists, false otherwise.
 */
export const verifyAdmin = async (adminId: string | null): Promise<boolean> => {
  if (!adminId) return false; // Invalid adminId
  const admin = await staffModel.findById(adminId).lean();
  return admin?.role === 'admin' || admin?.role === 'superadmin';
};

/**
 * Fetches the detailed information of a project based on its ID.
 * @param req - HTTP incoming request
 * @returns Detailed project information or an appropriate error message.
 */
export async function GET(req: Request) {
  await dbConnect(); // Ensure the database connection is established

  try {
    const url = new URL(req.url);
    const adminId = url.searchParams.get('adminId');
    const projectId = url.searchParams.get('id');

    // Validate admin authorization
    const isAdmin = await verifyAdmin(adminId);
    if (!isAdmin) {
      return createResponse(403, false, 'Unauthorized User');
    }

    // Validate and fetch project details
    if (!projectId) {
      return createResponse(400, false, 'Project ID is required');
    }

    const project = await clientModel.findById(projectId).lean();
    if (!project) {
      return createResponse(404, false, 'Project Not Found');
    }

    // Successfully return the project details
    return createResponse(200, true, project);
  } catch (error: unknown) {
    console.error('Error fetching project details:', error); // Log the error
    return createResponse(
      500,
      false,
      'An unexpected error occurred while processing the request'
    );
  }
}
