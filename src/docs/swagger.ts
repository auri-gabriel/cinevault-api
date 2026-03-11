import swaggerJSDoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CineVault API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
});

export default swaggerSpec;
