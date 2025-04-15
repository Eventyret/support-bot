import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// AI chat endpoint
router.post('/chat', async (req, res) => {
    try {
        const { messages, sessionId } = req.body;

        // Log incoming chat request
        console.log('\n=== INCOMING CHAT REQUEST ===');
        console.log(`Session ID: ${sessionId || 'New Session'}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log('Messages:');
        messages.forEach((msg, index) => {
            console.log(`  [${index + 1}] ${msg.role.toUpperCase()}: ${msg.content}`);
        });
        console.log('=============================\n');

        // Get the latest user message
        const latestMessage = messages[messages.length - 1];

        // Format the request body for n8n
        const requestBody = {
            message: latestMessage.content,
            role: latestMessage.role,
            sessionId: sessionId || null,
            timestamp: new Date().toISOString()
        };

        console.log('Sending to n8n:', JSON.stringify(requestBody, null, 2));

        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        console.log(`Forwarding request to n8n webhook: ${n8nWebhookUrl}`);

        // Send request to n8n
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Get the response data
        let responseData;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            // Parse JSON response
            responseData = await response.json();
            console.log('Received from n8n:', JSON.stringify(responseData, null, 2));
        } else {
            // Handle plain text response
            const textResponse = await response.text();
            console.log('Received from n8n (text):', textResponse);
            responseData = { output: textResponse };
        }

        // Check if the response was successful
        if (!response.ok) {
            // If n8n returned an error, try to extract the error message
            const errorMessage = responseData.message || responseData.error || 'Unknown error from n8n';
            const errorHint = responseData.hint || '';
            console.error(`n8n error: ${errorMessage}`);

            // Return a regular JSON error response
            return res.status(response.status).json({
                id: `chat_error_${Date.now()}`,
                role: 'assistant',
                content: `Error: ${errorMessage}${errorHint ? `\n\nHint: ${errorHint}` : ''}`,
                createdAt: new Date()
            });
        }

        // Extract the response from n8n's format
        let n8nResponse;
        if (Array.isArray(responseData) && responseData.length > 0) {
            // If n8n returns an array, try to find the response in the first item
            n8nResponse = responseData[0].output || responseData[0].response || responseData[0].message || responseData[0].content || 'No response from n8n';
        } else if (typeof responseData === 'object') {
            // If n8n returns an object, try to find the response in the object
            n8nResponse = responseData.output || responseData.response || responseData.message || responseData.content || 'No response from n8n';
        } else {
            // If n8n returns a string, use it directly
            n8nResponse = responseData;
        }

        // Log the complete response
        console.log('\n=== AI RESPONSE ===');
        console.log(`Session ID: ${sessionId || 'New Session'}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log(`Response: ${n8nResponse}`);
        console.log('==================\n');

        // Format the response for the frontend
        const formattedResponse = {
            id: `chat_${Date.now()}`,
            role: 'assistant',
            content: n8nResponse,
            createdAt: new Date()
        };

        // Return the formatted response
        res.json(formattedResponse);
    } catch (error) {
        console.error('Error in AI chat:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        // Return a regular JSON error response
        res.status(500).json({
            id: `chat_error_${Date.now()}`,
            role: 'assistant',
            content: `Error: ${error.message || 'An unknown error occurred'}`,
            createdAt: new Date()
        });
    }
});

export default router; 