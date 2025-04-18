import { vi } from 'vitest';

export const connectDB = vi.fn(async () => {
    if (global.mongoose) {
        console.log('Using existing mongoose connection');
        return global.mongoose;
    }

    if (!process.env.DATABASE_URL) {
        throw new Error('MONGODB_URI is undefined. Please check your .env file.');
    }

    const connection = await vi.mocked(import('mongoose')).connect(process.env.DATABASE_URL);
    global.mongoose = connection;
    return connection;
}); 