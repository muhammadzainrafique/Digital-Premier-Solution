import dbConnect from '@/lib/dbConnect';
import clientModel from '@/models/clientModel';
import { Client } from '@/types/clientTypes';
import { createResponse } from '@/utils/helperFunctions';

// Validate input data
const validateClientData = (data: Partial<Client>) => {
  console.log('i am called from create route');
  const { name, email, contactNumber, requiredService } = data;
  if (!name || !email || !contactNumber || !requiredService) {
    return 'All fields (name, email, contact number, and required service) are required.';
  }
  return null;
};

export async function POST(req: Request) {
  await dbConnect(); // Ensure database connection

  try {
    // Parse request body
    const clientData: Partial<Client> = await req.json();

    // Validate client data
    const validationError = validateClientData(clientData);
    if (validationError) {
      return createResponse(400, false, validationError);
    }

    // Create new client entry in the database
    const newClient = await clientModel.create(clientData);
    if (!newClient) {
      return createResponse(
        500,
        false,
        'Failed to create client. Please try again.'
      );
    }

    // Successful response
    return createResponse(
      200,
      true,
      'Thank you for reaching out! Our team will contact you shortly.'
    );
  } catch (error) {
    console.error('Error creating client:', error);

    // Internal server error response
    return createResponse(
      500,
      false,
      'An unexpected error occurred. Please try again later.'
    );
  }
}
