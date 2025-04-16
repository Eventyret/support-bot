export async function isDuplicateMessage(message, sessionId, messageModel, timeWindowMs = 5000) {
    if (!message || !sessionId || !messageModel) {
        throw new Error('Missing required parameters');
    }

    // Check for required message fields
    if (!message.content || !message.role) {
        throw new Error('Message must have content and role');
    }

    try {
        // Check if this message already exists in the database to prevent duplicates
        const existingMessage = await messageModel.findOne({
            content: message.content,
            role: message.role,
            sessionId: sessionId,
            createdAt: {
                $gte: new Date(Date.now() - timeWindowMs) // Within the specified time window
            }
        });

        // Return true if a matching message was found
        return !!existingMessage;
    } catch (error) {
        console.error('Error checking for duplicate message:', error);
        // In case of error, return false (treat as not duplicate) to avoid blocking messages
        return false;
    }
}

export function formatN8nResponse(responseData) {
    if (!responseData) {
        return 'No response from n8n';
    }

    let n8nResponse;

    if (Array.isArray(responseData) && responseData.length > 0) {
        // If n8n returns an array, try to find the response in the first item
        n8nResponse = responseData[0].output ||
            responseData[0].response ||
            responseData[0].message ||
            responseData[0].content ||
            'No response from n8n';
    } else if (typeof responseData === 'object') {
        // If n8n returns an object, try to find the response in the object
        n8nResponse = responseData.output ||
            responseData.response ||
            responseData.message ||
            responseData.content ||
            'No response from n8n';
    } else {
        // If n8n returns a string, use it directly
        n8nResponse = responseData;
    }

    return n8nResponse;
} 