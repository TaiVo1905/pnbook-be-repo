/**
 * @swagger
 * /search/posts:
 *   get:
 *     tags: [Searches]
 *     summary: Search posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 'hello world'
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
 *         description: List of posts matching search
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostsListResponse'
 */

/**
 * @swagger
 * /search/users:
 *   get:
 *     tags: [Searches]
 *     summary: Search users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Nguyen'
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
 *         description: List of users matching search
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 */

/**
 * @swagger
 * /search-history:
 *   get:
 *     tags: [Searches]
 *     summary: Get search history
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
 *         description: List of search history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchHistoryListResponse'
 */

/**
 * @swagger
 * /search-history/{id}:
 *   delete:
 *     tags: [Searches]
 *     summary: Delete a search history item
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
 *         description: Search history deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Search history not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * /search-history:
 *   delete:
 *     tags: [Searches]
 *     summary: Clear all search history
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All search history cleared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
