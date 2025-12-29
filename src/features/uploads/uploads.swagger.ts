/**
 * @swagger
 * /get-presigned-url:
 *   post:
 *     tags: [Uploads]
 *     summary: Generate a presigned URL for file upload
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PresignedUrlRequest'
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PresignedUrlResponse'
 */

/**
 * @swagger
 * /get-limited-time-url:
 *   post:
 *     tags: [Uploads]
 *     summary: Generate a limited-time URL to access a file
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LimitedTimeUrlRequest'
 *     responses:
 *       200:
 *         description: Limited-time URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LimitedTimeUrlResponse'
 */
