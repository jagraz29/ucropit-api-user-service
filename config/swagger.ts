import swaggerJsDoc from 'swagger-jsdoc'

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'UCROP.IT CORE API',
      description: 'UCROP.IT main API information',
      contact: {
        name: 'Lucas Michailian'
      },
      servers: ['https://localhost:3000']
    }
  },
  apis: ['./dist/src/models/User.js', './dist/src/routes/**/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export { swaggerDocs }
