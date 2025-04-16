import express from 'express';
import { createMessage, getSessionMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/:sessionId', getSessionMessages);

export default router; 