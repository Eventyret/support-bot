import { config } from '../config/env.js';

export const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    // Debug logging
    console.log('Received API Key:', apiKey);
    console.log('Expected API Key:', config.cleanupApiKey);
    console.log('Headers:', req.headers);

    if (!apiKey || apiKey !== config.cleanupApiKey) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid API key'
        });
    }

    next();
}; 