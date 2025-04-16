import express from 'express';
import { createSession, getSessionById, getAllSessions } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', createSession);
router.get('/:id', getSessionById);
router.get('/', getAllSessions);

export default router; 