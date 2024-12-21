import dbConnect from '@/lib/dbConnect';
import clientModel from '@/models/clientModel';
import { createResponse } from '@/utils/helperFunctions';

/**
 * Fetches the latest 10 completed projects from the database.
 * @param req - The incoming HTTP request.
 * @returns A response containing the latest projects or an error message.
 */
export async function GET(req: Request) {
  // Ensure database connection
  await dbConnect();

  try {
    // Fetch the latest 10 completed projects
    const latestProjects = await clientModel
      .find({ status: 'Completed' })
      .sort({ date: -1 }) // Sort by date in descending order
      .limit(10)
      .lean();

    // Handle case where no projects are found
    if (!latestProjects.length) {
      return createResponse(404, false, 'No completed projects found.');
    }

    // Return the projects
    return createResponse(200, true, latestProjects);
  } catch (error) {
    // Log the error and return a generic server error response
    console.error('Error fetching latest projects:', error);
    return createResponse(
      500,
      false,
      'An unexpected error occurred. Please try again.'
    );
  }
}
