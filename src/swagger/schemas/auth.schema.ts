export const authSchemas = {
  SignUpRequest: {
    type: 'object',
    required: ['name', 'email', 'password', 'passwordConfirmation'],
    properties: {
      name: {
        type: 'string',
        example: 'Nguyendat',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'nguyendat@student.passerellesnumeriques.org',
      },
      password: {
        type: 'string',
        minLength: 8,
        example: '123456789',
      },
      passwordConfirmation: {
        type: 'string',
        example: '123456789',
      },
    },
  },
  SignInRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'nguyendat@student.passerellesnumeriques.org',
      },
      password: {
        type: 'string',
        example: '123456789',
      },
    },
  },
  GoogleAuthRequest: {
    type: 'object',
    required: ['authCode'],
    properties: {
      authCode: {
        type: 'string',
        example: '4/0AX4XfWjK1exampleAuthCode',
      },
    },
  },
  AuthResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 200,
      },
      message: {
        type: 'string',
        example: 'User signed in successfully',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
  SignUpResponse: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 201,
      },
      message: {
        type: 'string',
        example: 'User registered successfully',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-12-30T04:40:26.830Z',
      },
    },
  },
};
