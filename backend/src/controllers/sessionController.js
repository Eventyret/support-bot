import crypto from 'crypto';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import { connectDB } from '../lib/mongoose.js';

/**
 * Generate a random session ID
 * @returns {string} A randomly generated hexadecimal session ID
 */
export const generateSessionId = () => {
    return crypto.randomBytes(16).toString('hex');
};

/**
 * Create a new session
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const createSession = async (req, res) => {
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
};

/**
 * Get a session by ID with its associated messages
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getSessionById = async (req, res) => {
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
};

/**
 * Get all sessions with their associated messages
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getAllSessions = async (req, res) => {
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
}; 