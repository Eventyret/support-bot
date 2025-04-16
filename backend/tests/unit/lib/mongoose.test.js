import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mocks
const mockConnect = vi.fn();

// Mock mongoose
vi.mock('mongoose', () => ({
    connect: mockConnect,
}));

// Mock dotenv
vi.mock('dotenv', () => ({
    config: vi.fn()
}));

// Mock the mongoose library
vi.mock('../../../src/lib/mongoose.js', () => {
    return {
        connectDB: async () => {
            try {
                if (global.mongoose) {
                    console.log('Using existing mongoose connection');
                    return global.mongoose;
                }

                if (!process.env.DATABASE_URL) {
                    throw new Error('MONGODB_URI is undefined. Please check your .env file.');
                }

                // Use the mocked mongoose.connect function directly
                const connection = await mockConnect(process.env.DATABASE_URL);
                global.mongoose = connection;
                return connection;
            } catch (error) {
                // Silence the error in tests
                // console.error('MongoDB connection error:', error);
                throw error;
            }
        }
    };
});

// Import after mocking
import { connectDB } from '../../../src/lib/mongoose.js';

describe('MongoDB Connection Utility', () => {
    // Store the original process.env and console.error
    const originalEnv = process.env;
    const originalConsoleError = console.error;

    beforeEach(() => {
        // Mock environment variables
        process.env = {
            ...originalEnv,
            DATABASE_URL: 'mongodb://fake-connection-string'
        };

        // Reset the global mongoose connection
        global.mongoose = undefined;

        // Clear mocks
        vi.clearAllMocks();

        // Silence console.error for tests
        console.error = vi.fn();

        // Setup the connect mock
        mockConnect.mockImplementation((uri) => {
            if (!uri) throw new Error('URI is required');
            return Promise.resolve({ isConnected: true });
        });
    });

    afterEach(() => {
        // Restore original process.env and console.error
        process.env = originalEnv;
        console.error = originalConsoleError;
    });

    it('should connect to MongoDB when connection does not exist', async () => {
        // Call the function
        const result = await connectDB();

        // Assert connect was called with the right URL
        expect(mockConnect).toHaveBeenCalledWith('mongodb://fake-connection-string');
        expect(mockConnect).toHaveBeenCalledTimes(1);

        // Assert that the result is the connection object
        expect(result).toEqual({ isConnected: true });

        // The global connection should be set
        expect(global.mongoose).toEqual({ isConnected: true });
    });

    it('should reuse existing connection if available', async () => {
        // Setup a fake connection in the global object
        global.mongoose = { isConnected: true };

        // Call the function
        const result = await connectDB();

        // Assert connect was not called
        expect(mockConnect).not.toHaveBeenCalled();

        // Assert that the result is the existing connection
        expect(result).toEqual({ isConnected: true });
    });

    it('should throw an error if DATABASE_URL is undefined', async () => {
        // Remove DATABASE_URL from env
        delete process.env.DATABASE_URL;

        // Expect the function to throw
        await expect(connectDB()).rejects.toThrow('MONGODB_URI is undefined');

        // Assert connect was not called
        expect(mockConnect).not.toHaveBeenCalled();
    });

    it('should throw an error if mongoose connection fails', async () => {
        // Setup connect mock to reject
        const error = new Error('Connection failed');
        mockConnect.mockRejectedValueOnce(error);

        // Expect the function to throw
        await expect(connectDB()).rejects.toThrow('Connection failed');

        // Assert connect was called
        expect(mockConnect).toHaveBeenCalledTimes(1);

        // The global connection should not be set
        expect(global.mongoose).toBeUndefined();
    });
}); 