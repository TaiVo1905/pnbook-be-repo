/**
 * @swagger
 * /conversations:
 *   get:
 *     tags: [Messages]
 *     summary: Get list of conversations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationsListResponse'
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
 *       - name: receiverId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: user-123
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessagesListResponse'
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
 *               $ref: '#/components/schemas/MessageResponse'
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
 *               $ref: '#/components/schemas/MessageResponse'
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
 *               $ref: '#/components/schemas/DeleteMessageResponse'
 */

/**
 * @swagger
 * /messages/mark-as-read:
 *   post:
 *     tags: [Messages]
 *     summary: Mark messages as read
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkAsReadRequest'
 *     responses:
 *       200:
 *         description: Messages marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
