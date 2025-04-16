import express from 'express';
import crypto from 'crypto';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import { connectDB } from '../lib/mongoose.js';

const router = express.Router();

export const generateSessionId = () => {
    return crypto.randomBytes(16).toString('hex');
};

export const handlers = {
    createSession: async (req, res) => {
        try {
            await connectDB();

            const sessionId = generateSessionId();

            console.log(`Creating new session with ID: ${sessionId}`);

            const existingSession = await Session.findById(sessionId);
            if (existingSession) {
                console.log(`Session with ID ${sessionId} already exists, returning existing session`);
                return res.json(existingSession);
            }

            const session = await Session.create({
                _id: sessionId,
                sessionID: sessionId
            });

            console.log(`Session created successfully: ${sessionId}`);
            res.status(201).json(session);
        } catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({ error: 'Failed to create session' });
        }
    },

    getSessionById: async (req, res) => {
        try {
            await connectDB();

            const sessionId = req.params.id;
            console.log(`Fetching session: ${sessionId}`);

            const session = await Session.findById(sessionId);

            if (!session) {
                console.log(`Session not found: ${sessionId}`);
                return res.status(404).json({ error: 'Session not found' });
            }

            const messages = await Message.find({ sessionId: sessionId }).sort({ createdAt: 1 });
            console.log(`Found ${messages.length} messages for session: ${sessionId}`);

            const sessionWithMessages = {
                ...session.toObject(),
                messages
            };

            res.json(sessionWithMessages);
        } catch (error) {
            console.error('Error fetching session:', error);
            res.status(500).json({ error: 'Failed to fetch session' });
        }
    },

    getAllSessions: async (req, res) => {
        try {
            await connectDB();

            const sessions = await Session.find();
            console.log(`Found ${sessions.length} total sessions`);

            const sessionsWithMessages = await Promise.all(
                sessions.map(async (session) => {
                    const messages = await Message.find({ sessionId: session._id }).sort({ createdAt: 1 });
                    return {
                        ...session.toObject(),
                        messages
                    };
                })
            );

            res.json(sessionsWithMessages);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            res.status(500).json({ error: 'Failed to fetch sessions' });
        }
    }
};

router.post('/', handlers.createSession);
router.get('/:id', handlers.getSessionById);
router.get('/', handlers.getAllSessions);

export default router; 