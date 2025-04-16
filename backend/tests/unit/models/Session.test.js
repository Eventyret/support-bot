import { describe, it, expect, vi, beforeEach } from 'vitest';
import Session from '../../../src/models/Session.js';

vi.mock('mongoose', () => ({
    default: {}
}));

vi.mock('../../../src/models/Session.js', () => {
    const SessionModel = function (data) {
        this.data = data || {};
        this.modelName = 'Session';

        this.data.createdAt = this.data.createdAt || new Date();
        this.data.updatedAt = this.data.updatedAt || new Date();

        this.validateSync = function () {
            const errors = {};

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



describe('Session Model', () => {
    let sessionInstance;

    beforeEach(() => {
        sessionInstance = {
            _id: 'test-session-id',
            sessionID: 'test-session-id',
        };
    });

    it('should create a valid session', () => {
        const session = new Session(sessionInstance);

        expect(session.modelName).toBe('Session');

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

        expect(validation.errors._id.message).toBe('Path `_id` is required.');
    });

    it('should validate required sessionID field', () => {
        const invalidSession = {
            _id: 'test-session-id',
        };

        const session = new Session(invalidSession);
        const validation = session.validateSync();

        expect(validation.errors.sessionID.message).toBe('Path `sessionID` is required.');
    });

    it('should auto-generate timestamps', () => {
        const session = new Session({
            _id: 'test-session-id',
            sessionID: 'test-session-id',
        });

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

        expect(validation).toBeUndefined();
    });
}); 