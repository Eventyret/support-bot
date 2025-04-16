import Message from '../models/Message.js';

/**
 * Create a new message
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export const createMessage = async (req, res) => {
    try {
        const { content, role, sessionId } = req.body;

        if (!content || !role || !sessionId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const message = await Message.create({
            content,
            role,
            sessionId
        });

        res.json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
};

/**
 * Get all messages for a session
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export const getSessionMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            sessionId: req.params.sessionId
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}; 