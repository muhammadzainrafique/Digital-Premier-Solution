import mongoose from 'mongoose';

interface ConnectionObjectType {
  isConnected?: number;
}

const connectionObject: ConnectionObjectType = {};

const dbConnect = async () => {
  try {
    // Checking for already established connection
    if (connectionObject.isConnected) {
      console.log('Connection is Already Established');
      return;
    }

    // Check if process.env.MONGOOSE_URI is available
    if (!process.env.MONGOOSE_URI) {
      throw new Error(
        'MONGOOSE_URI is not defined in the environment variables.'
      );
    }

    // Establish a new connection to the database
    const conn = await mongoose.connect(process.env.MONGOOSE_URI);

    // Update the connection state
    connectionObject.isConnected = conn.connections[0].readyState;

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error: ', error);
    process.exit(1);
  }
};

export default dbConnect;
