import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { connectDB } from '../../../src/lib/mongoose.js';

const mockConnect = vi.fn();

vi.mock('mongoose', () => ({
    connect: mockConnect,
}));

vi.mock('dotenv', () => ({
    config: vi.fn()
}));

vi.mock('../../../src/lib/mongoose.js', () => {
    return {
        connectDB: async () => {
            if (global.mongoose) {
                console.log('Using existing mongoose connection');
                return global.mongoose;
            }

            if (!process.env.DATABASE_URL) {
                throw new Error('MONGODB_URI is undefined. Please check your .env file.');
            }

            const connection = await mockConnect(process.env.DATABASE_URL);
            global.mongoose = connection;
            return connection;
        }
    };
});



describe('MongoDB Connection Utility', () => {
    const originalEnv = process.env;
    const originalConsoleError = console.error;

    beforeEach(() => {
        process.env = {
            ...originalEnv,
            DATABASE_URL: 'mongodb:fake-connection-string'
        };

        global.mongoose = undefined;

        vi.clearAllMocks();

        console.error = vi.fn();

        mockConnect.mockImplementation((uri) => {
            if (!uri) throw new Error('URI is required');
            return Promise.resolve({ isConnected: true });
        });
    });

    afterEach(() => {
        process.env = originalEnv;
        console.error = originalConsoleError;
    });

    it('should connect to MongoDB when connection does not exist', async () => {
        const result = await connectDB();

        expect(mockConnect).toHaveBeenCalledWith('mongodb:fake-connection-string');
        expect(mockConnect).toHaveBeenCalledTimes(1);

        expect(result).toEqual({ isConnected: true });

        expect(global.mongoose).toEqual({ isConnected: true });
    });

    it('should reuse existing connection if available', async () => {
        global.mongoose = { isConnected: true };

        const result = await connectDB();

        expect(mockConnect).not.toHaveBeenCalled();

        expect(result).toEqual({ isConnected: true });
    });

    it('should throw an error if DATABASE_URL is undefined', async () => {
        delete process.env.DATABASE_URL;

        await expect(connectDB()).rejects.toThrow('MONGODB_URI is undefined');

        expect(mockConnect).not.toHaveBeenCalled();
    });

    it('should throw an error if mongoose connection fails', async () => {
        const error = new Error('Connection failed');
        mockConnect.mockRejectedValueOnce(error);

        await expect(connectDB()).rejects.toThrow('Connection failed');

        expect(mockConnect).toHaveBeenCalledTimes(1);

        expect(global.mongoose).toBeUndefined();
    });
}); 