/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - _id
 *         - sessionID
 *       properties:
 *         _id:
 *           type: string
 *           description: The session ID
 *         sessionID:
 *           type: string
 *           description: The session ID (duplicate of _id)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the session was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the session was last updated
 *       example:
 *         _id: "5f8d0f3e9d3e2a0017b5e1a5"
 *         sessionID: "5f8d0f3e9d3e2a0017b5e1a5"
 *         createdAt: "2023-12-01T12:00:00Z"
 *         updatedAt: "2023-12-01T12:00:00Z"
 */ 