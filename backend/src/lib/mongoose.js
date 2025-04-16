import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a global object to store the mongoose connection
const globalForMongoose = global;

// Get the MongoDB connection URL from environment variables
const MONGODB_URI = process.env.DATABASE_URL;

// Check if the connection URL is defined
if (!MONGODB_URI) {
    console.error('MONGODB_URI is undefined. Please check your .env file.');
    console.log('Current environment variables:', Object.keys(process.env));
}

// Function to connect to MongoDB
export const connectDB = async () => {
    try {
        if (globalForMongoose.mongoose) {
            console.log('Using existing mongoose connection');
            return globalForMongoose.mongoose;
        }

        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is undefined. Please check your .env file.');
        }

        console.log('Creating new mongoose connection');
        const connection = await mongoose.connect(MONGODB_URI);

        // Store the connection in the global object
        globalForMongoose.mongoose = connection;

        console.log('MongoDB connected successfully');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Export the mongoose instance
export default mongoose; 