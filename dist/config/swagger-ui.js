"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'UCROP.IT CORE API',
            description: 'UCROP.IT main API information',
            contact: {
                name: 'Lucas Michailian'
            },
            servers: ['https://localhost:3000']
        }
    },
    apis: ['./dist/src/routes/**/*.js']
};
const swaggerDocs = swagger_jsdoc_1.default(swaggerOptions);
exports.swaggerDocs = swaggerDocs;
//# sourceMappingURL=swagger-ui.js.map