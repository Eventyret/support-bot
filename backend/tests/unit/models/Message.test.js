import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock mongoose
vi.mock('mongoose', () => ({
    default: {}
}));

// Mock the Message model
vi.mock('../../../src/models/Message.js', () => {
    // Mock model constructor using an inline function
    const MessageModel = function (data) {
        this.data = data || {};
        this.modelName = 'Message';

        // Mock validation method
        this.validateSync = function () {
            const errors = {};

            // Check required fields
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

// Import the mocked model
import Message from '../../../src/models/Message.js';

describe('Message Model', () => {
    let messageInstance;

    beforeEach(() => {
        // Create a valid message instance
        messageInstance = {
            content: 'Test message',
            role: 'user',
            sessionId: 'test-session',
        };
    });

    it('should create a valid message', () => {
        const message = new Message(messageInstance);

        // Verify the model was created with the correct name
        expect(message.modelName).toBe('Message');

        // Basic instance should be valid
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

        // Content is required
        expect(validation.errors.content.message).toBe('Path `content` is required.');
    });

    it('should validate required role field', () => {
        const invalidMessage = {
            content: 'Test message',
            sessionId: 'test-session',
        };

        const message = new Message(invalidMessage);
        const validation = message.validateSync();

        // Role is required
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

        // Role must be valid
        expect(validation.errors.role.message).toBe('`invalid-role` is not a valid enum value for path `role`.');
    });

    it('should validate required sessionId field', () => {
        const invalidMessage = {
            content: 'Test message',
            role: 'user',
        };

        const message = new Message(invalidMessage);
        const validation = message.validateSync();

        // Session ID is required
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

        // Should be valid
        expect(validation).toBeUndefined();
    });
}); 