import express from 'express';
import { cleanupOldChats, previewCleanup } from '../lib/cleanup.js';
import { agenda } from '../lib/agenda.js';
import { requireApiKey } from '../middleware/auth.js';

const router = express.Router();

// Protect all cleanup routes with API key
router.use(requireApiKey);

// Preview what would be cleaned up
router.get('/preview', async (req, res) => {
    try {
        const preview = await previewCleanup();
        res.json({
            success: true,
            preview: {
                ...preview,
                cleanupAge: `${preview.cleanupAge / (1000 * 60 * 60 * 24)} days`,
                cutoffDate: preview.cutoffDate.toISOString()
            }
        });
    } catch (error) {
        console.error('Error getting cleanup preview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cleanup preview',
            error: error.message
        });
    }
});

// Get cleanup job status and next run time
router.get('/status', async (req, res) => {
    try {
        const jobs = await agenda.jobs({ name: 'cleanup old chats' });
        const job = jobs[0];

        res.json({
            success: true,
            status: {
                isScheduled: jobs.length > 0,
                nextRun: job ? job.nextRunAt : null,
                lastRun: job ? job.lastRunAt : null,
                lastFinished: job ? job.lastFinishedAt : null
            }
        });
    } catch (error) {
        console.error('Error getting cleanup status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cleanup status',
            error: error.message
        });
    }
});

// Manually trigger cleanup
router.post('/run', async (req, res) => {
    try {
        const job = await agenda.now('cleanup old chats');
        res.status(202).json({
            success: true,
            message: 'Cleanup job scheduled for immediate execution',
            jobId: job.attrs._id
        });
    } catch (error) {
        console.error('Error scheduling cleanup:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to schedule cleanup',
            error: error.message
        });
    }
});

// Update cleanup schedule
router.post('/schedule', async (req, res) => {
    try {
        const { schedule } = req.body;

        if (!schedule) {
            return res.status(400).json({
                success: false,
                message: 'Schedule is required (e.g., "0 0 * * *" for daily at midnight)'
            });
        }

        // Remove existing schedule
        await agenda.cancel({ name: 'cleanup old chats' });

        // Create new schedule
        await agenda.every(schedule, 'cleanup old chats');

        res.json({
            success: true,
            message: 'Cleanup schedule updated successfully'
        });
    } catch (error) {
        console.error('Error updating cleanup schedule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cleanup schedule',
            error: error.message
        });
    }
});

// Cancel scheduled cleanup
router.post('/cancel', async (req, res) => {
    try {
        await agenda.cancel({ name: 'cleanup old chats' });
        res.json({
            success: true,
            message: 'Cleanup schedule cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling cleanup:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel cleanup schedule',
            error: error.message
        });
    }
});

export default router; 