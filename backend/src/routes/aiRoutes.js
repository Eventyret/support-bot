import express from 'express';
import { processChat, getChatHistory } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', processChat);
router.get('/chat/:sessionId', getChatHistory);

export default router; 