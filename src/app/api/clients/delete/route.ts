import dbConnect from '@/lib/dbConnect';
import { verifyAdmin } from '../get/route';
import { createResponse } from '@/utils/helperFunctions';
import clientModel from '@/models/clientModel';

/**
 * Deletes a project after verifying admin credentials and ensuring the
 *  project status is 'Cancelled'.
 *
 * @param req HTTP incoming request
 * @returns Response object with the result of the operation
 */
export async function DELETE(req: Request) {
  try {
    // Establish a database connection
    await dbConnect();

    // Extract adminId and projectId from the request URL
    const url = new URL(req.url);
    const adminId = url.searchParams.get('adminId');
    const projectId = url.searchParams.get('id');

    // Validate admin authorization
    if (!adminId) {
      return createResponse(400, false, 'Admin ID is required');
    }
    const isAdmin = await verifyAdmin(adminId);
    if (!isAdmin) {
      return createResponse(403, false, 'Unauthorized User');
    }

    // Validate project ID
    if (!projectId) {
      return createResponse(400, false, 'Project ID is required');
    }

    // Fetch project details
    const project = await clientModel.findById(projectId);
    if (!project) {
      return createResponse(404, false, 'Project Not Found');
    }

    // Check project status
    if (project.status !== 'Cancelled') {
      return createResponse(
        400,
        false,
        "You can't delete this project as it is not Cancelled"
      );
    }

    // Delete the project
    await project.deleteOne();

    // Respond with success
    return createResponse(200, true, 'Project Deleted Successfully');
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error('Error deleting project:', error);

    // Return an internal server error response
    return createResponse(
      500,
      false,
      'An error occurred while deleting the project'
    );
  }
}
