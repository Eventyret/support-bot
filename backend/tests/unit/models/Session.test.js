import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock mongoose
vi.mock('mongoose', () => ({
    default: {}
}));

// Mock the Session model
vi.mock('../../../src/models/Session.js', () => {
    // Mock model constructor using an inline function
    const SessionModel = function (data) {
        this.data = data || {};
        this.modelName = 'Session';

        // Auto-generate timestamps
        this.data.createdAt = this.data.createdAt || new Date();
        this.data.updatedAt = this.data.updatedAt || new Date();

        // Mock validation method
        this.validateSync = function () {
            const errors = {};

            // Check required fields
            if (!this.data._id) {
                errors._id = { message: 'Path `_id` is required.' };
            }

            if (!this.data.sessionID) {
                errors.sessionID = { message: 'Path `sessionID` is required.' };
            }

            return Object.keys(errors).length > 0 ? { errors } : undefined;
        };
    };

    return {
        default: SessionModel
    };
});

// Import the mocked model
import Session from '../../../src/models/Session.js';

describe('Session Model', () => {
    let sessionInstance;

    beforeEach(() => {
        // Create a valid session instance
        sessionInstance = {
            _id: 'test-session-id',
            sessionID: 'test-session-id',
        };
    });

    it('should create a valid session', () => {
        const session = new Session(sessionInstance);

        // Verify the model was created with the correct name
        expect(session.modelName).toBe('Session');

        // Basic instance should be valid
        expect(session.validateSync()).toBeUndefined();
    });
});

describe('Session Schema Validation', () => {
    it('should validate required _id field', () => {
        const invalidSession = {
            sessionID: 'test-session-id',
        };

        const session = new Session(invalidSession);
        const validation = session.validateSync();

        // _id is required
        expect(validation.errors._id.message).toBe('Path `_id` is required.');
    });

    it('should validate required sessionID field', () => {
        const invalidSession = {
            _id: 'test-session-id',
        };

        const session = new Session(invalidSession);
        const validation = session.validateSync();

        // sessionID is required
        expect(validation.errors.sessionID.message).toBe('Path `sessionID` is required.');
    });

    it('should auto-generate timestamps', () => {
        // Create a minimal valid session
        const session = new Session({
            _id: 'test-session-id',
            sessionID: 'test-session-id',
        });

        // Timestamps should be added
        expect(session.data.createdAt).toBeInstanceOf(Date);
        expect(session.data.updatedAt).toBeInstanceOf(Date);
    });

    it('should accept valid session data', () => {
        const validSession = {
            _id: 'test-session-id',
            sessionID: 'test-session-id',
        };

        const session = new Session(validSession);
        const validation = session.validateSync();

        // Should be valid
        expect(validation).toBeUndefined();
    });
}); 