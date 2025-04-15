import express from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new session
router.post('/', async (req, res) => {
    try {
        // Generate a random, anonymous session ID
        const sessionId = crypto.randomBytes(16).toString('hex');

        const session = await prisma.session.create({
            data: {
                id: sessionId
            }
        });

        res.json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// Get a session by ID
router.get('/:id', async (req, res) => {
    try {
        const session = await prisma.session.findUnique({
            where: { id: req.params.id },
            include: { messages: true }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

// Get all sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            include: { messages: true }
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

export default router; 