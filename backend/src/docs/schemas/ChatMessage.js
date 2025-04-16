/**
 * @swagger
 * components:
 *   schemas:
 *     ChatMessage:
 *       type: object
 *       required:
 *         - role
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The message ID
 *         role:
 *           type: string
 *           enum: [user, assistant]
 *           description: The role of the message sender
 *         content:
 *           type: string
 *           description: The content of the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message was created
 *       example:
 *         id: "chat_1620120000000"
 *         role: "assistant"
 *         content: "How can I help you today?"
 *         createdAt: "2023-12-01T12:00:00Z"
 */ 