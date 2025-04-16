/**
 * Utility functions for generating standardized API responses
 */

/**
 * Creates a success response with standard format
 * @param {Object} data - The data to include in the response
 * @param {string} message - Optional success message
 * @param {number} status - HTTP status code (default: 200)
 * @returns {Object} Formatted success response object
 */
export const successResponse = (data, message = 'Success', status = 200) => ({
    success: true,
    status,
    message,
    data
});

/**
 * Creates an error response with standard format
 * @param {string} message - Error message
 * @param {Error|null} error - Optional error object
 * @param {number} status - HTTP status code (default: 500)
 * @returns {Object} Formatted error response object
 */
export const errorResponse = (message, error = null, status = 500) => ({
    success: false,
    status,
    message,
    error: error?.message || error
});

/**
 * Creates a standard chat message response
 * @param {string} content - Message content
 * @param {string} role - Message role (user/assistant)
 * @param {string} sessionId - Session ID
 * @returns {Object} Formatted chat message response
 */
export const chatResponse = (content, role = 'assistant', sessionId = null) => ({
    id: `chat_${Date.now()}`,
    role,
    content,
    createdAt: new Date(),
    sessionId
}); 