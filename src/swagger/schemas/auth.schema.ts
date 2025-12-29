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
        example: 'nguyendat@example.com',
      },
      password: {
        type: 'string',
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
    required: ['name', 'email', 'password'],
    properties: {
      name: {
        type: 'string',
        example: 'Nguyendat',
      },
      email: {
        type: 'string',
        example: 'nguyendat@example.com',
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
      accessToken: {
        type: 'string',
        example: 'access-token-example',
      },
      refreshToken: {
        type: 'string',
        example: 'refresh-token-example',
      },
    },
  },
};
