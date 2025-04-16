/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management API
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - role
 *               - sessionId
 *             properties:
 *               content:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, assistant]
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/messages/{sessionId}:
 *   get:
 *     summary: Get all messages for a session
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The session ID
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 */ 