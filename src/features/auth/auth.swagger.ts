/**
 * @swagger
 * /auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in with Google OAuth
 *     description: Authenticate users using their Google account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleAuthRequest'
 *     responses:
 *       200:
 *         description: User signed in with Google successfully
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly cookies for accessToken (1h) and refreshToken (7d)
 *             schema:
 *               type: string
 *               example: accessToken=jwt; Path=/; HttpOnly; SameSite=Strict; Secure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     tags: [Auth]
 *     summary: Sign up with email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       201:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignUpResponse'
 */

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in with Email and Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly cookies for accessToken (1h) and refreshToken (7d)
 *             schema:
 *               type: string
 *               example: accessToken=jwt; Path=/; HttpOnly; SameSite=Strict; Secure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
/**
 * @swagger
 * /auth/sign-out:
 *  get:
 *   tags: [Auth]
 *  summary: Sign out the user
 *  description: Sign out the authenticated user by clearing their tokens.
 *  responses:
 *    200:
 *     description: User signed out successfully
 *    content:
 *     application/json:
 *      schema:
 *      $ref: '#/components/schemas/SignOutResponse'
 */
