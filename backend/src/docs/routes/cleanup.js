/**
 * @swagger
 * tags:
 *   name: Cleanup
 *   description: Cleanup utilities for managing old chat sessions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CleanupPreview:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the preview was successfully generated
 *         preview:
 *           type: object
 *           properties:
 *             cleanupAge:
 *               type: string
 *               description: The age threshold for cleanup in days
 *             cutoffDate:
 *               type: string
 *               format: date-time
 *               description: The date before which sessions will be deleted
 *             sessionsToDelete:
 *               type: integer
 *               description: Number of sessions that would be deleted
 *             messagesToDelete:
 *               type: integer
 *               description: Number of messages that would be deleted
 *     CleanupStatus:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the status request was successful
 *         status:
 *           type: object
 *           properties:
 *             isScheduled:
 *               type: boolean
 *               description: Whether a cleanup job is scheduled
 *             nextRun:
 *               type: string
 *               format: date-time
 *               description: When the next cleanup will run
 *             lastRun:
 *               type: string
 *               format: date-time
 *               description: When the last cleanup ran
 *             lastFinished:
 *               type: string
 *               format: date-time
 *               description: When the last cleanup finished
 */

/**
 * @swagger
 * /api/cleanup/preview:
 *   get:
 *     summary: Preview what will be cleaned up
 *     tags: [Cleanup]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Cleanup preview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CleanupPreview'
 *       401:
 *         description: Unauthorized - API key required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cleanup/status:
 *   get:
 *     summary: Get status of cleanup jobs
 *     tags: [Cleanup]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Cleanup job status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CleanupStatus'
 *       401:
 *         description: Unauthorized - API key required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cleanup/run:
 *   post:
 *     summary: Run cleanup job immediately
 *     tags: [Cleanup]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       202:
 *         description: Cleanup job scheduled for immediate execution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 jobId:
 *                   type: string
 *       401:
 *         description: Unauthorized - API key required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cleanup/schedule:
 *   post:
 *     summary: Set cleanup schedule
 *     tags: [Cleanup]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schedule
 *             properties:
 *               schedule:
 *                 type: string
 *                 description: Cron schedule expression (e.g., "0 0 * * *" for daily at midnight)
 *     responses:
 *       200:
 *         description: Cleanup schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized - API key required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cleanup/cancel:
 *   post:
 *     summary: Cancel scheduled cleanup jobs
 *     tags: [Cleanup]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Cleanup schedule cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - API key required
 *       500:
 *         description: Server error
 */ 