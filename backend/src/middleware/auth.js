export const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.CLEANUP_API_KEY;

    if (!apiKey || apiKey !== expectedKey) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid API key'
        });
    }

    next();
}; 