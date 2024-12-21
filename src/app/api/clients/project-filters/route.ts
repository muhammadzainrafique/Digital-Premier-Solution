import dbConnect from '@/lib/dbConnect';
import clientModel from '@/models/clientModel';
import { createResponse } from '@/utils/helperFunctions';

/**
 * Filters projects based on year or service value.
 * @param req - The incoming HTTP request containing query parameters `year` and/or `service`.
 * @returns A response with filtered projects or an error message.
 */
export async function GET(req: Request) {
  // Ensure database connection
  await dbConnect();

  try {
    const url = new URL(req.url);
    const year = url.searchParams.get('year');
    const service = url.searchParams.get('service');

    // Build filter query
    const query: Record<string, any> = {};

    if (year) {
      // Filter by year using the date field
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);
      query.date = { $gte: startOfYear, $lte: endOfYear };
    }

    if (service) {
      // Filter by requiredService field
      query.requiredService = service;
    }

    // Fetch filtered projects
    const projects = await clientModel.find(query).lean();

    // Handle case where no projects match the filter
    if (!projects.length) {
      return createResponse(
        404,
        false,
        'No projects found matching the criteria.'
      );
    }

    // Return the filtered projects
    return createResponse(200, true, projects);
  } catch (error) {
    // Log error and return server error response
    console.error('Error filtering projects:', error);
    return createResponse(
      500,
      false,
      'An unexpected error occurred. Please try again.'
    );
  }
}
