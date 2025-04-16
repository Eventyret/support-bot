import express from 'express';
import fetch from 'node-fetch';
import { connectDB } from '../lib/mongoose.js';
import Session from '../models/Session.js';
import Message from '../models/Message.js';

const router = express.Router();

// AI chat endpoint
router.post('/chat', async (req, res) => {
    try {
        const { messages, sessionId } = req.body;

        // Validate session ID
        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Connect to MongoDB
        await connectDB();

        // Check if session exists
        let session = await Session.findById(sessionId);

        // If session doesn't exist, create it
        if (!session) {
            console.log(`🆕 Session ${sessionId} not found, creating new session`);
            session = await Session.create({
                _id: sessionId,
                sessionID: sessionId
            });
        } else {
            console.log(`🔄 Using existing session: ${sessionId}`);
        }

        // Get the latest user message
        const latestMessage = messages[messages.length - 1];

        // Simplified logging with emojis
        console.log(`\n💬 [${sessionId}] User: ${latestMessage.content}`);

        // Check if this message already exists in the database to prevent duplicates
        const existingMessage = await Message.findOne({
            content: latestMessage.content,
            role: latestMessage.role,
            sessionId: sessionId,
            createdAt: {
                $gte: new Date(Date.now() - 5000) // Within the last 5 seconds
            }
        });

        // Only create a new message if it doesn't already exist
        if (!existingMessage) {
            // Store the user message in MongoDB
            await Message.create({
                content: latestMessage.content,
                role: latestMessage.role,
                sessionId: sessionId
            });
            console.log(`💾 Stored user message in MongoDB`);
        } else {
            console.log(`⚠️ Message already exists, skipping creation`);
        }

        // Format the request body for n8n
        const requestBody = {
            message: latestMessage.content,
            role: latestMessage.role,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            // Include message history for context
            messageHistory: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        };

        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        console.log(`📤 Sending to n8n webhook`);

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
        } else {
            // Handle plain text response
            const textResponse = await response.text();
            responseData = { output: textResponse };
        }

        // Check if the response was successful
        if (!response.ok) {
            // If n8n returned an error, try to extract the error message
            const errorMessage = responseData.message || responseData.error || 'Unknown error from n8n';
            const errorHint = responseData.hint || '';
            console.error(`❌ n8n error: ${errorMessage}`);

            // Store the error message in MongoDB
            await Message.create({
                content: `Error: ${errorMessage}${errorHint ? `\n\nHint: ${errorHint}` : ''}`,
                role: 'assistant',
                sessionId: sessionId
            });

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

        // Store the assistant's response in MongoDB
        await Message.create({
            content: n8nResponse,
            role: 'assistant',
            sessionId: sessionId
        });

        // Simplified logging with emojis
        console.log(`🤖 [${sessionId}] Assistant: ${n8nResponse.substring(0, 100)}${n8nResponse.length > 100 ? '...' : ''}`);
        console.log(`💾 Stored assistant response in MongoDB\n`);

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
        console.error(`❌ Error in AI chat: ${error.message}`);
        console.error(`🔍 Stack: ${error.stack.substring(0, 200)}...`);

        // Return a regular JSON error response
        res.status(500).json({
            id: `chat_error_${Date.now()}`,
            role: 'assistant',
            content: `Error: ${error.message || 'An unknown error occurred'}`,
            createdAt: new Date()
        });
    }
});

// Get chat history for a session
router.get('/chat/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Validate session ID
        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Connect to MongoDB
        await connectDB();

        // Find the session
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Find all messages for this session
        const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });

        // Format messages for the frontend
        const formattedMessages = messages.map(msg => ({
            id: msg._id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt
        }));

        res.json({
            sessionId: session._id,
            messages: formattedMessages,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt
        });
    } catch (error) {
        console.error(`❌ Error fetching chat history: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

export default router; 