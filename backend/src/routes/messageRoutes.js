const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new message
router.post('/', async (req, res) => {
    try {
        const { content, role, sessionId } = req.body;

        if (!content || !role || !sessionId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const message = await prisma.message.create({
            data: {
                content,
                role,
                sessionId
            }
        });

        res.json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create message' });
    }
});

// Get messages for a session
router.get('/:sessionId', async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            where: { sessionId: req.params.sessionId },
            orderBy: { createdAt: 'asc' }
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router; 