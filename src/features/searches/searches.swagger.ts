/**
 * @swagger
 * /search/posts:
 *   get:
 *     tags: [Searches]
 *     summary: Search posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 'hello world'
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
 *         description: List of posts matching search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 count:
 *                   type: integer
 *                   example: 10
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
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Nguyen'
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
 *         description: List of users matching search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 count:
 *                   type: integer
 *                   example: 10
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
 *           example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: List of search history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SearchHistory'
 *                 count:
 *                   type: integer
 *                   example: 10
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
