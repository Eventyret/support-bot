import { connectDB } from '../lib/mongoose.js';

/**
 * Middleware to ensure MongoDB connection is established
 * This eliminates the need to call connectDB() in every route handler
 */
export const ensureDbConnection = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Failed to connect to database:', error);
        res.status(500).json({ error: 'Database connection error' });
    }
}; 