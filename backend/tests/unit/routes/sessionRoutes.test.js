import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import dependencies and handlers first
import * as sessionRoutes from '../../../src/routes/sessionRoutes.js';
import { connectDB } from '../../../src/lib/mongoose.js';
import Session from '../../../src/models/Session.js';
import Message from '../../../src/models/Message.js';

// Now mock the dependencies
vi.mock('../../../src/lib/mongoose.js', () => ({
    connectDB: vi.fn().mockResolvedValue(true)
}));

// Mock Message model
vi.mock('../../../src/models/Message.js', () => ({
    default: {
        find: vi.fn().mockImplementation(() => ({
            sort: vi.fn().mockReturnValue([
                { content: 'Test message 1' },
                { content: 'Test message 2' }
            ])
        }))
    }
}));

// Mock Session model
vi.mock('../../../src/models/Session.js', () => ({
    default: {
        find: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn()
    }
}));

describe('Session Route Handlers', () => {
    // Setup mock request and response
    let mockReq;
    let mockRes;
    let originalConsoleLog;
    let originalConsoleError;

    beforeEach(() => {
        // Save original console methods
        originalConsoleLog = console.log;
        originalConsoleError = console.error;

        // Silence console during tests
        console.log = vi.fn();
        console.error = vi.fn();

        // Reset all mocks
        vi.clearAllMocks();

        // Setup mock request and response
        mockReq = {
            params: {},
            body: {}
        };

        mockRes = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        // Restore console methods after each test
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    });

    describe('getAllSessions', () => {
        it('should return all sessions with their messages when successful', async () => {
            // Setup mock data
            const mockSessions = [
                {
                    _id: 'session1',
                    sessionID: 'session1',
                    toObject: () => ({ _id: 'session1', sessionID: 'session1' })
                },
                {
                    _id: 'session2',
                    sessionID: 'session2',
                    toObject: () => ({ _id: 'session2', sessionID: 'session2' })
                }
            ];

            // Setup mocks
            Session.find.mockResolvedValueOnce(mockSessions);

            // Call the handler
            await sessionRoutes.handlers.getAllSessions(mockReq, mockRes);

            // Assertions - just check that the json method was called
            expect(connectDB).toHaveBeenCalled();
            expect(Session.find).toHaveBeenCalled();
            expect(Message.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalled();
        });

        it('should handle errors when fetching sessions', async () => {
            // Setup error
            const error = new Error('Database error');
            Session.find.mockRejectedValueOnce(error);

            // Call the handler
            await sessionRoutes.handlers.getAllSessions(mockReq, mockRes);

            // Assertions
            expect(connectDB).toHaveBeenCalled();
            expect(Session.find).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch sessions' });
            expect(console.error).toHaveBeenCalledWith('Error fetching sessions:', error);
        });
    });

    describe('getSessionById', () => {
        it('should return a session with its messages', async () => {
            // Setup mock request
            mockReq.params.id = 'session1';

            // Setup mock data
            const mockSession = {
                _id: 'session1',
                sessionID: 'session1',
                toObject: () => ({ _id: 'session1', sessionID: 'session1' })
            };

            // Setup mocks
            Session.findById.mockResolvedValueOnce(mockSession);

            // Call the handler
            await sessionRoutes.handlers.getSessionById(mockReq, mockRes);

            // Assertions
            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalledWith('session1');
            expect(Message.find).toHaveBeenCalledWith({ sessionId: 'session1' });
            expect(mockRes.json).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('Fetching session: session1');
        });

        it('should return 404 when session not found', async () => {
            // Setup mock request
            mockReq.params.id = 'nonexistent';

            // Setup mock
            Session.findById.mockResolvedValueOnce(null);

            // Call the handler
            await sessionRoutes.handlers.getSessionById(mockReq, mockRes);

            // Assertions
            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalledWith('nonexistent');
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Session not found' });
            expect(console.log).toHaveBeenCalledWith('Session not found: nonexistent');
        });

        it('should handle errors when fetching a session', async () => {
            // Setup mock request
            mockReq.params.id = 'session1';

            // Setup error
            const error = new Error('Database error');
            Session.findById.mockRejectedValueOnce(error);

            // Call the handler
            await sessionRoutes.handlers.getSessionById(mockReq, mockRes);

            // Assertions
            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalledWith('session1');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch session' });
            expect(console.error).toHaveBeenCalledWith('Error fetching session:', error);
        });
    });

    describe('createSession', () => {
        it('should create a new session', async () => {
            // Setup mock data - use any ID here, we don't care about the exact value
            const mockSession = {
                _id: 'some-session-id',
                sessionID: 'some-session-id'
            };

            // Setup mocks
            Session.findById.mockResolvedValueOnce(null); // Session doesn't exist
            Session.create.mockResolvedValueOnce(mockSession);

            // Call the handler
            await sessionRoutes.handlers.createSession(mockReq, mockRes);

            // Assertions - don't check the specific ID, just that the steps were called
            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalled(); // ID will be random, so don't check specific value
            expect(Session.create).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockSession);
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Session created successfully:'));
        });

        it('should return existing session if it already exists', async () => {
            // Setup mock data - use any ID
            const existingSession = {
                _id: 'some-session-id',
                sessionID: 'some-session-id'
            };

            // Setup mocks
            Session.findById.mockResolvedValueOnce(existingSession); // Session exists

            // Call the handler
            await sessionRoutes.handlers.createSession(mockReq, mockRes);

            // Assertions - don't check specific ID
            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalled();
            expect(Session.create).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(existingSession);
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Session with ID'));
        });

        it('should handle errors when creating a session', async () => {
            // Setup error
            const error = new Error('Database error');
            Session.findById.mockRejectedValueOnce(error);

            // Call the handler
            await sessionRoutes.handlers.createSession(mockReq, mockRes);

            // Assertions - don't check specific ID
            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create session' });
            expect(console.error).toHaveBeenCalledWith('Error creating session:', error);
        });
    });
}); 