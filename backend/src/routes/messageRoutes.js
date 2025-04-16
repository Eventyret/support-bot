import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.post('/', async (req, res) => {
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
});

router.get('/:sessionId', async (req, res) => {
    try {
        const messages = await Message.find({
            sessionId: req.params.sessionId
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

export default router; 