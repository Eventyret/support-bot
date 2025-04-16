import express from 'express';
import { requireApiKey } from '../middleware/auth.js';
import {
    getCleanupPreview,
    getCleanupStatus,
    runCleanupNow,
    scheduleCleanup,
    cancelCleanup
} from '../controllers/cleanupController.js';

const router = express.Router();

router.use(requireApiKey);

router.get('/preview', getCleanupPreview);
router.get('/status', getCleanupStatus);
router.post('/run', runCleanupNow);
router.post('/schedule', scheduleCleanup);
router.post('/cancel', cancelCleanup);

export default router; 