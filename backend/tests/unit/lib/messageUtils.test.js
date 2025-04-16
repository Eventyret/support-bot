import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isDuplicateMessage, formatN8nResponse } from '../../../src/lib/messageUtils.js';

describe('isDuplicateMessage', () => {
    // Mock message model
    const mockMessageModel = {
        findOne: vi.fn()
    };

    // Mock message data
    const validMessage = {
        content: 'Test message',
        role: 'user'
    };

    const validSessionId = 'test-session-id';
    const originalConsoleError = console.error;

    beforeEach(() => {
        // Reset mock before each test
        vi.resetAllMocks();
        // Silence console.error for tests
        console.error = vi.fn();
    });

    afterEach(() => {
        // Restore original console.error
        console.error = originalConsoleError;
    });

    it('should return true when a duplicate message is found', async () => {
        // Setup mock to return a message (indicating a duplicate was found)
        mockMessageModel.findOne.mockResolvedValueOnce({
            _id: 'existing-message-id',
            content: 'Test message',
            role: 'user',
            sessionId: 'test-session-id'
        });

        const result = await isDuplicateMessage(validMessage, validSessionId, mockMessageModel);

        // Verify findOne was called with the correct criteria
        expect(mockMessageModel.findOne).toHaveBeenCalledTimes(1);
        expect(mockMessageModel.findOne.mock.calls[0][0]).toMatchObject({
            content: 'Test message',
            role: 'user',
            sessionId: 'test-session-id'
        });

        // Result should be true (duplicate found)
        expect(result).toBe(true);
    });

    it('should return false when no duplicate message is found', async () => {
        // Setup mock to return null (no duplicate found)
        mockMessageModel.findOne.mockResolvedValueOnce(null);

        const result = await isDuplicateMessage(validMessage, validSessionId, mockMessageModel);

        // Verify findOne was called
        expect(mockMessageModel.findOne).toHaveBeenCalledTimes(1);

        // Result should be false (no duplicate)
        expect(result).toBe(false);
    });

    it('should throw an error when message is missing', async () => {
        await expect(
            isDuplicateMessage(null, validSessionId, mockMessageModel)
        ).rejects.toThrow('Missing required parameters');

        // Verify findOne was not called
        expect(mockMessageModel.findOne).not.toHaveBeenCalled();
    });

    it('should throw an error when sessionId is missing', async () => {
        await expect(
            isDuplicateMessage(validMessage, null, mockMessageModel)
        ).rejects.toThrow('Missing required parameters');

        // Verify findOne was not called
        expect(mockMessageModel.findOne).not.toHaveBeenCalled();
    });

    it('should throw an error when messageModel is missing', async () => {
        await expect(
            isDuplicateMessage(validMessage, validSessionId, null)
        ).rejects.toThrow('Missing required parameters');

        // No findOne to check as messageModel is null
    });

    it('should throw an error when message is missing content', async () => {
        const invalidMessage = { role: 'user' };

        await expect(
            isDuplicateMessage(invalidMessage, validSessionId, mockMessageModel)
        ).rejects.toThrow('Message must have content and role');

        // Verify findOne was not called
        expect(mockMessageModel.findOne).not.toHaveBeenCalled();
    });

    it('should throw an error when message is missing role', async () => {
        const invalidMessage = { content: 'Test message' };

        await expect(
            isDuplicateMessage(invalidMessage, validSessionId, mockMessageModel)
        ).rejects.toThrow('Message must have content and role');

        // Verify findOne was not called
        expect(mockMessageModel.findOne).not.toHaveBeenCalled();
    });

    it('should return false when database query throws an error', async () => {
        // Setup mock to throw an error
        mockMessageModel.findOne.mockRejectedValueOnce(new Error('Database error'));

        // Should not throw but return false
        const result = await isDuplicateMessage(validMessage, validSessionId, mockMessageModel);

        // Verify findOne was called
        expect(mockMessageModel.findOne).toHaveBeenCalledTimes(1);

        // Result should be false (error treated as no duplicate)
        expect(result).toBe(false);

        // Verify console.error was called
        expect(console.error).toHaveBeenCalled();
    });

    it('should use custom time window', async () => {
        // Setup Date.now mock
        const mockNow = 1672569600000; // 2023-01-01T12:00:00Z in milliseconds
        const realDateNow = Date.now;
        Date.now = vi.fn(() => mockNow);

        // Custom time window of 10 seconds
        const timeWindowMs = 10000;
        mockMessageModel.findOne.mockResolvedValueOnce(null);

        await isDuplicateMessage(validMessage, validSessionId, mockMessageModel, timeWindowMs);

        // Verify findOne was called with the correct time window
        expect(mockMessageModel.findOne).toHaveBeenCalledTimes(1);

        // Check that the time window is correct in the query
        const callArg = mockMessageModel.findOne.mock.calls[0][0];
        expect(callArg.createdAt.$gte).toBeInstanceOf(Date);

        // The date should be 10 seconds before the mock date
        const expectedDate = new Date(mockNow - timeWindowMs);
        expect(callArg.createdAt.$gte.getTime()).toBe(expectedDate.getTime());

        // Restore Date.now
        Date.now = realDateNow;
    });
});

describe('formatN8nResponse', () => {
    it('should return default message when input is null or undefined', () => {
        expect(formatN8nResponse(null)).toBe('No response from n8n');
        expect(formatN8nResponse(undefined)).toBe('No response from n8n');
    });

    it('should extract response from array format', () => {
        const arrayResponse = [{
            output: 'Response from output field'
        }];

        expect(formatN8nResponse(arrayResponse)).toBe('Response from output field');
    });

    it('should try multiple fields in array format', () => {
        // No output field, should try response field
        const arrayResponse = [{
            response: 'Response from response field'
        }];

        expect(formatN8nResponse(arrayResponse)).toBe('Response from response field');
    });

    it('should extract response from object format', () => {
        const objectResponse = {
            output: 'Response from output field'
        };

        expect(formatN8nResponse(objectResponse)).toBe('Response from output field');
    });

    it('should try multiple fields in object format', () => {
        // No output field, should try message field
        const objectResponse = {
            message: 'Response from message field'
        };

        expect(formatN8nResponse(objectResponse)).toBe('Response from message field');
    });

    it('should handle string response directly', () => {
        const stringResponse = 'Direct string response';

        expect(formatN8nResponse(stringResponse)).toBe('Direct string response');
    });

    it('should handle empty array', () => {
        const emptyArray = [];

        expect(formatN8nResponse(emptyArray)).toBe('No response from n8n');
    });

    it('should handle array with no recognized fields', () => {
        const arrayWithUnknownFields = [{
            unknown: 'This field is not recognized'
        }];

        expect(formatN8nResponse(arrayWithUnknownFields)).toBe('No response from n8n');
    });

    it('should handle object with no recognized fields', () => {
        const objectWithUnknownFields = {
            unknown: 'This field is not recognized'
        };

        expect(formatN8nResponse(objectWithUnknownFields)).toBe('No response from n8n');
    });
}); 