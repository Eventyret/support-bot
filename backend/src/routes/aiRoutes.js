import express from 'express';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const router = express.Router();
const prisma = new PrismaClient();

// Stream AI response
router.post('/chat', async (req, res) => {
    try {
        const { messages, sessionId } = req.body;

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // TODO: Replace with your n8n webhook URL
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

        // Send request to n8n
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                sessionId,
            }),
        });

        // Handle streaming response from n8n
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            res.write(`data: ${chunk}\n\n`);
        }

        // Save the complete response to the database
        const aiResponse = await prisma.message.create({
            data: {
                content: messages[messages.length - 1].content,
                role: 'assistant',
                sessionId,
            },
        });

        res.end();
    } catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

export default router; 