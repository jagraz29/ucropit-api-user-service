import swaggerJsDoc from 'swagger-jsdoc'

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'UCROP.IT CORE API',
      description: 'UCROP.IT main API information',
      contact: {
        name: 'Lucas Michailian'
      }
    },
    servers: [
      { url: 'https://aws-apidev.ucrop.it' },
      { url: 'https://aws-apiqa.ucrop.it' },
      { url: 'https://aws-apipreprod.ucrop.it' }
    ],
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
  apis: [
    './dist/src/models/**/*.js',
    './dist/src/routes/**/*.js',
    './dist/src/swagger/**/*.js'
  ]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export { swaggerDocs }
