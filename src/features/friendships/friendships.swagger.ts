/**
 * @swagger
 * /friendships:
 *   get:
 *     tags: [Friendships]
 *     summary: Get my friends list
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
 *         description: List of my friends
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendListResponse'
 */

/**
 * @swagger
 * /users/{id}/friends:
 *   get:
 *     tags: [Friendships]
 *     summary: Get friends of a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *         description: List of user's friends
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendListResponse'
 */

/**
 * @swagger
 * /friendships/requests:
 *   get:
 *     tags: [Friendships]
 *     summary: Get friend requests sent to me
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
 *         description: List of friend requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendListResponse'
 */

/**
 * @swagger
 * /friendships:
 *   post:
 *     tags: [Friendships]
 *     summary: Send friend request
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendFriendRequestBody'
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendshipResponse'
 */

/**
 * @swagger
 * /friendships/requests/{requesterId}/accept:
 *   patch:
 *     tags: [Friendships]
 *     summary: Accept friend request
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: requesterId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request accepted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * /friendships/requests/{requesterId}:
 *   delete:
 *     tags: [Friendships]
 *     summary: Reject friend request
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: requesterId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * /friendships/{friendId}:
 *   patch:
 *     tags: [Friendships]
 *     summary: Update friendship status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: friendId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFriendshipBody'
 *     responses:
 *       200:
 *         description: Friendship updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendshipResponse'
 */

/**
 * @swagger
 * /friendships/{friendId}:
 *   delete:
 *     tags: [Friendships]
 *     summary: Delete friendship
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: friendId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friendship deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
