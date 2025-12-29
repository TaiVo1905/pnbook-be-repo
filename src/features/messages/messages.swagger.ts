/**
 * @swagger
 * /conversations:
 *   get:
 *     tags: [Messages]
 *     summary: Get list of conversations
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 *                 count:
 *                   type: integer
 *                   example: 10
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     tags: [Messages]
 *     summary: Get messages of a conversation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: conversationId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: conversation-123
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 count:
 *                   type: integer
 *                   example: 50
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     tags: [Messages]
 *     summary: Send a message
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageBody'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */

/**
 * @swagger
 * /messages/{id}:
 *   patch:
 *     tags: [Messages]
 *     summary: Update message content
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMessageBody'
 *     responses:
 *       200:
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     tags: [Messages]
 *     summary: Delete a message
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
