import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';

// Use the direct absolute path to the .env file in the project root
const envPath = '/Users/eventyret/Development/support-bot/.env';

console.log('🔍 Attempting to load .env from:', envPath);
console.log('📄 This file exists:', fs.existsSync(envPath));

dotenv.config({ path: envPath });

const globalForMongoose = global;

const MONGODB_URI = process.env.DATABASE_URL;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is undefined. Please check your .env file.');
    console.log('Current environment variables:', Object.keys(process.env));
}

export const connectDB = async () => {
    try {
        if (globalForMongoose.mongoose) {
            console.log('🔄 Using existing mongoose connection');
            return globalForMongoose.mongoose;
        }

        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is undefined. Please check your .env file.');
        }

        console.log('🔌 Creating new mongoose connection');
        const connection = await mongoose.connect(MONGODB_URI);

        globalForMongoose.mongoose = connection;

        console.log('✅ MongoDB connected successfully');
        return connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};

export default mongoose; 