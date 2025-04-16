/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - content
 *         - role
 *         - sessionId
 *       properties:
 *         _id:
 *           type: string
 *           description: The message ID
 *         content:
 *           type: string
 *           description: The content of the message
 *         role:
 *           type: string
 *           description: The role of the message sender (user or assistant)
 *           enum: [user, assistant]
 *         sessionId:
 *           type: string
 *           description: The ID of the session this message belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was last updated
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         content: "Hello, how can I help you today?"
 *         role: "assistant"
 *         sessionId: "5f8d0f3e9d3e2a0017b5e1a5"
 *         createdAt: "2023-12-01T12:00:00Z"
 *         updatedAt: "2023-12-01T12:00:00Z"
 */ 