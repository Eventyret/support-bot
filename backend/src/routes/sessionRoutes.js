import express from 'express';
import crypto from 'crypto';
import { connectDB } from '../lib/mongoose.js';
import Session from '../models/Session.js';
import Message from '../models/Message.js';

const router = express.Router();

// Helper function to generate session ID - easier to mock in tests
export const generateSessionId = () => {
    return crypto.randomBytes(16).toString('hex');
};

// Handler functions - exported for testing
export const handlers = {
    // Create a new session
    createSession: async (req, res) => {
        try {
            // Connect to MongoDB
            await connectDB();

            // Generate a random, anonymous session ID
            const sessionId = generateSessionId();

            console.log(`Creating new session with ID: ${sessionId}`);

            // Check if a session with this ID already exists (unlikely but possible)
            const existingSession = await Session.findById(sessionId);
            if (existingSession) {
                console.log(`Session with ID ${sessionId} already exists, returning existing session`);
                return res.json(existingSession);
            }

            // Create a new session
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

    // Get a session by ID
    getSessionById: async (req, res) => {
        try {
            // Connect to MongoDB
            await connectDB();

            const sessionId = req.params.id;
            console.log(`Fetching session: ${sessionId}`);

            // Find the session and include all messages
            const session = await Session.findById(sessionId);

            if (!session) {
                console.log(`Session not found: ${sessionId}`);
                return res.status(404).json({ error: 'Session not found' });
            }

            // Find all messages for this session
            const messages = await Message.find({ sessionId: sessionId }).sort({ createdAt: 1 });
            console.log(`Found ${messages.length} messages for session: ${sessionId}`);

            // Combine session and messages
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

    // Get all sessions
    getAllSessions: async (req, res) => {
        try {
            // Connect to MongoDB
            await connectDB();

            // Find all sessions
            const sessions = await Session.find();
            console.log(`Found ${sessions.length} total sessions`);

            // For each session, find its messages
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

// Set up routes
router.post('/', handlers.createSession);
router.get('/:id', handlers.getSessionById);
router.get('/', handlers.getAllSessions);

export default router; 