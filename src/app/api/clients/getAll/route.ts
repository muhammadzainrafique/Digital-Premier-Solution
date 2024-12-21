import dbConnect from '@/lib/dbConnect';
import clientModel from '@/models/clientModel';
import { Client } from '@/types/clientTypes';
import { createResponse } from '@/utils/helperFunctions';
import { verifyAdmin } from '../get/route';

export async function GET(req: Request) {
  await dbConnect(); // Ensure the database connection is established

  try {
    // Parse adminId from the query string
    const adminId = new URL(req.url).searchParams.get('id');
    if (!adminId) {
      return createResponse(400, false, 'Admin ID is required.');
    }

    // Verify admin access
    const isAdmin = await verifyAdmin(adminId);
    if (!isAdmin) {
      return createResponse(403, false, 'Unauthorized user.');
    }

    // Fetch all projects
    const projects: Client[] = await clientModel.find({}).lean();
    if (projects.length === 0) {
      return createResponse(404, false, 'No projects found.');
    }

    // Return projects in the response
    return createResponse(200, true, projects);
  } catch (error) {
    console.error('Error fetching projects:', error);

    // Handle unexpected errors
    return createResponse(
      500,
      false,
      'An unexpected error occurred. Please try again.'
    );
  }
}
