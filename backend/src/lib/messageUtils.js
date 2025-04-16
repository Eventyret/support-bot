export async function isDuplicateMessage(message, sessionId, messageModel, timeWindowMs = 5000) {
    if (!message || !sessionId || !messageModel) {
        throw new Error('Missing required parameters');
    }

    if (!message.content || !message.role) {
        throw new Error('Message must have content and role');
    }

    try {
        const existingMessage = await messageModel.findOne({
            content: message.content,
            role: message.role,
            sessionId: sessionId,
            createdAt: {
                $gte: new Date(Date.now() - timeWindowMs)
            }
        });

        return !!existingMessage;
    } catch (error) {
        console.error('Error checking for duplicate message:', error);
        return false;
    }
}

export function formatN8nResponse(responseData) {
    if (!responseData) {
        return 'No response from n8n';
    }

    let n8nResponse;

    if (Array.isArray(responseData) && responseData.length > 0) {
        n8nResponse = responseData[0].output ||
            responseData[0].response ||
            responseData[0].message ||
            responseData[0].content ||
            'No response from n8n';
    } else if (typeof responseData === 'object') {
        n8nResponse = responseData.output ||
            responseData.response ||
            responseData.message ||
            responseData.content ||
            'No response from n8n';
    } else {
        n8nResponse = responseData;
    }

    return n8nResponse;
} 