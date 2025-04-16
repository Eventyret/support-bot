import express from 'express';
import fetch from 'node-fetch';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import { isDuplicateMessage, formatN8nResponse } from '../lib/messageUtils.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { messages, sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        let session = await Session.findById(sessionId);

        if (!session) {
            console.log(`🆕 Session ${sessionId} not found, creating new session`);
            session = await Session.create({
                _id: sessionId,
                sessionID: sessionId
            });
        } else {
            console.log(`🔄 Using existing session: ${sessionId}`);
        }

        const latestMessage = messages[messages.length - 1];
        console.log(`\n💬 [${sessionId}] User: ${latestMessage.content}`);

        const isDuplicate = await isDuplicateMessage(latestMessage, sessionId, Message);

        if (!isDuplicate) {
            await Message.create({
                content: latestMessage.content,
                role: latestMessage.role,
                sessionId: sessionId
            });
            console.log(`💾 Stored user message in MongoDB`);
        } else {
            console.log(`⚠️ Message already exists, skipping creation`);
        }

        const requestBody = {
            message: latestMessage.content,
            role: latestMessage.role,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            messageHistory: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        };

        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        console.log(`📤 Sending to n8n webhook`);

        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        let responseData;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const textResponse = await response.text();
            responseData = { output: textResponse };
        }

        if (!response.ok) {
            const errorMessage = responseData.message || responseData.error || 'Unknown error from n8n';
            const errorHint = responseData.hint || '';
            console.error(`❌ n8n error: ${errorMessage}`);

            await Message.create({
                content: `Error: ${errorMessage}${errorHint ? `\n\nHint: ${errorHint}` : ''}`,
                role: 'assistant',
                sessionId: sessionId
            });

            return res.status(response.status).json({
                id: `chat_error_${Date.now()}`,
                role: 'assistant',
                content: `Error: ${errorMessage}${errorHint ? `\n\nHint: ${errorHint}` : ''}`,
                createdAt: new Date()
            });
        }

        const n8nResponse = formatN8nResponse(responseData);

        await Message.create({
            content: n8nResponse,
            role: 'assistant',
            sessionId: sessionId
        });

        console.log(`🤖 [${sessionId}] Assistant: ${n8nResponse.substring(0, 100)}${n8nResponse.length > 100 ? '...' : ''}`);
        console.log(`💾 Stored assistant response in MongoDB\n`);

        const formattedResponse = {
            id: `chat_${Date.now()}`,
            role: 'assistant',
            content: n8nResponse,
            createdAt: new Date()
        };

        res.json(formattedResponse);
    } catch (error) {
        console.error(`❌ Error in AI chat: ${error.message}`);
        console.error(`🔍 Stack: ${error.stack.substring(0, 200)}...`);

        res.status(500).json({
            id: `chat_error_${Date.now()}`,
            role: 'assistant',
            content: `Error: ${error.message || 'An unknown error occurred'}`,
            createdAt: new Date()
        });
    }
});

router.get('/chat/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });

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