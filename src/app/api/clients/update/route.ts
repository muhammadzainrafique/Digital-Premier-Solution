import dbConnect from '@/lib/dbConnect';
import clientModel from '@/models/clientModel';
import { Client } from '@/types/clientTypes';
import { createResponse } from '@/utils/helperFunctions';

/**
 * Updates the specified fields of a client project.
 * @param req - The incoming HTTP request.
 * @returns A response indicating the result of the operation.
 */
export async function PATCH(req: Request) {
  await dbConnect(); // Ensure the database connection is established

  try {
    // Extract project ID from the query string
    const projectId = new URL(req.url).searchParams.get('id');
    if (!projectId) {
      return createResponse(400, false, 'Project ID is required.');
    }

    // Parse the request body for updates
    const { title, description, status }: Partial<Client> = await req.json();

    // Fetch the existing project
    const project = await clientModel.findById(projectId);
    if (!project) {
      return createResponse(404, false, 'Project not found.');
    }

    // Update fields only if provided
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;

    // Save the updated project to the database
    await project.save();

    return createResponse(200, true, 'Project updated successfully.');
  } catch (error) {
    console.error('Error updating project:', error);
    return createResponse(
      500,
      false,
      'An unexpected error occurred. Please try again.'
    );
  }
}
