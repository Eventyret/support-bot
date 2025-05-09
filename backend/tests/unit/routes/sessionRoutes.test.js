import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as sessionController from '../../../src/controllers/sessionController.js';
import { connectDB } from '../../../src/lib/mongoose.js';
import Session from '../../../src/models/Session.js';
import Message from '../../../src/models/Message.js';

vi.mock('../../../src/lib/mongoose.js', () => ({
    connectDB: vi.fn().mockResolvedValue(true)
}));

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

vi.mock('../../../src/models/Session.js', () => ({
    default: {
        find: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn()
    }
}));

describe('Session Controller', () => {
    let mockReq;
    let mockRes;
    let originalConsoleLog;
    let originalConsoleError;

    beforeEach(() => {
        originalConsoleLog = console.log;
        originalConsoleError = console.error;

        console.log = vi.fn();
        console.error = vi.fn();

        vi.clearAllMocks();

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
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    });

    describe('getAllSessions', () => {
        it('should return all sessions with their messages when successful', async () => {
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

            Session.find.mockResolvedValueOnce(mockSessions);

            await sessionController.getAllSessions(mockReq, mockRes);

            expect(connectDB).toHaveBeenCalled();
            expect(Session.find).toHaveBeenCalled();
            expect(Message.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalled();
        });

        it('should handle errors when fetching sessions', async () => {
            const error = new Error('Database error');
            Session.find.mockRejectedValueOnce(error);

            await sessionController.getAllSessions(mockReq, mockRes);

            expect(connectDB).toHaveBeenCalled();
            expect(Session.find).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch sessions' });
            expect(console.error).toHaveBeenCalledWith('Error fetching sessions:', error);
        });
    });

    describe('getSessionById', () => {
        it('should return a session with its messages', async () => {
            mockReq.params.id = 'session1';

            const mockSession = {
                _id: 'session1',
                sessionID: 'session1',
                toObject: () => ({ _id: 'session1', sessionID: 'session1' })
            };

            Session.findById.mockResolvedValueOnce(mockSession);

            await sessionController.getSessionById(mockReq, mockRes);

            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalledWith('session1');
            expect(Message.find).toHaveBeenCalledWith({ sessionId: 'session1' });
            expect(mockRes.json).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('Fetching session: session1');
        });

        it('should return 404 when session not found', async () => {
            mockReq.params.id = 'nonexistent';

            Session.findById.mockResolvedValueOnce(null);

            await sessionController.getSessionById(mockReq, mockRes);

            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalledWith('nonexistent');
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Session not found' });
            expect(console.log).toHaveBeenCalledWith('Session not found: nonexistent');
        });

        it('should handle errors when fetching a session', async () => {
            mockReq.params.id = 'session1';

            const error = new Error('Database error');
            Session.findById.mockRejectedValueOnce(error);

            await sessionController.getSessionById(mockReq, mockRes);

            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalledWith('session1');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch session' });
            expect(console.error).toHaveBeenCalledWith('Error fetching session:', error);
        });
    });

    describe('createSession', () => {
        it('should create a new session', async () => {
            const mockSession = {
                _id: 'some-session-id',
                sessionID: 'some-session-id'
            };

            Session.findById.mockResolvedValueOnce(null);
            Session.create.mockResolvedValueOnce(mockSession);

            await sessionController.createSession(mockReq, mockRes);

            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalled();
            expect(Session.create).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockSession);
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Session created successfully:'));
        });

        it('should return existing session if it already exists', async () => {
            const existingSession = {
                _id: 'some-session-id',
                sessionID: 'some-session-id'
            };

            Session.findById.mockResolvedValueOnce(existingSession);

            await sessionController.createSession(mockReq, mockRes);

            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalled();
            expect(Session.create).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(existingSession);
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Session with ID'));
        });

        it('should handle errors when creating a session', async () => {
            const error = new Error('Database error');
            Session.findById.mockRejectedValueOnce(error);

            await sessionController.createSession(mockReq, mockRes);

            expect(connectDB).toHaveBeenCalled();
            expect(Session.findById).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create session' });
            expect(console.error).toHaveBeenCalledWith('Error creating session:', error);
        });
    });
}); 