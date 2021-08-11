import swaggerJsDoc from 'swagger-jsdoc'

const servers = [
  { url: 'https://aws-apidev.ucrop.it' },
  { url: 'https://aws-apiqa.ucrop.it' },
  { url: 'https://aws-apipreprod.ucrop.it' }
]

if (process.env.NODE_ENV === 'local') {
  servers.unshift({
    url: process.env.BASE_URL
  })
}

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
    servers,
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
    './dist/swagger/**/*.js'
  ]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export { swaggerDocs }
