import swaggerJsDoc from 'swagger-jsdoc'

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'UCROP.IT CORE API',
      description: 'UCROP.IT main API information',
      contact: {
        name: 'Lucas Michailian'
      },
      servers: ['https://localhost:3000']
    },
    basePath: '/',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./dist/src/models/**/*.js', './dist/src/routes/**/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export { swaggerDocs }
