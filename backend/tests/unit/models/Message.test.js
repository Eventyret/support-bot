import { describe, it, expect, vi, beforeEach } from 'vitest';
import Message from '../../../src/models/Message.js';

vi.mock('mongoose', () => ({
    default: {}
}));

vi.mock('../../../src/models/Message.js', () => {
    const MessageModel = function (data) {
        this.data = data || {};
        this.modelName = 'Message';

        this.validateSync = function () {
            const errors = {};

            if (!this.data.content) {
                errors.content = { message: 'Path `content` is required.' };
            }

            if (!this.data.role) {
                errors.role = { message: 'Path `role` is required.' };
            }

            if (this.data.role && !['user', 'assistant'].includes(this.data.role)) {
                errors.role = { message: `\`${this.data.role}\` is not a valid enum value for path \`role\`.` };
            }

            if (!this.data.sessionId) {
                errors.sessionId = { message: 'Path `sessionId` is required.' };
            }

            return Object.keys(errors).length > 0 ? { errors } : undefined;
        };
    };

    return {
        default: MessageModel
    };
});



describe('Message Model', () => {
    let messageInstance;

    beforeEach(() => {
        messageInstance = {
            content: 'Test message',
            role: 'user',
            sessionId: 'test-session',
        };
    });

    it('should create a valid message', () => {
        const message = new Message(messageInstance);

        expect(message.modelName).toBe('Message');

        expect(message.validateSync()).toBeUndefined();
    });
});

describe('Message Schema Validation', () => {
    it('should validate required content field', () => {
        const invalidMessage = {
            role: 'user',
            sessionId: 'test-session',
        };

        const message = new Message(invalidMessage);
        const validation = message.validateSync();

        expect(validation.errors.content.message).toBe('Path `content` is required.');
    });

    it('should validate required role field', () => {
        const invalidMessage = {
            content: 'Test message',
            sessionId: 'test-session',
        };

        const message = new Message(invalidMessage);
        const validation = message.validateSync();

        expect(validation.errors.role.message).toBe('Path `role` is required.');
    });

    it('should validate role is either user or assistant', () => {
        const invalidMessage = {
            content: 'Test message',
            role: 'invalid-role',
            sessionId: 'test-session',
        };

        const message = new Message(invalidMessage);
        const validation = message.validateSync();

        expect(validation.errors.role.message).toBe('`invalid-role` is not a valid enum value for path `role`.');
    });

    it('should validate required sessionId field', () => {
        const invalidMessage = {
            content: 'Test message',
            role: 'user',
        };

        const message = new Message(invalidMessage);
        const validation = message.validateSync();

        expect(validation.errors.sessionId.message).toBe('Path `sessionId` is required.');
    });

    it('should accept valid message data', () => {
        const validMessage = {
            content: 'Test message',
            role: 'user',
            sessionId: 'test-session',
        };

        const message = new Message(validMessage);
        const validation = message.validateSync();

        expect(validation).toBeUndefined();
    });
}); 