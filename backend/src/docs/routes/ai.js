/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI chat functionality
 */

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Send a message to the AI assistant
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *               - sessionId
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *               sessionId:
 *                 type: string
 *                 description: The session ID
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ai/chat/{sessionId}:
 *   get:
 *     summary: Get chat history for a session
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The session ID
 *     responses:
 *       200:
 *         description: Chat history for the session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing session ID
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */ 