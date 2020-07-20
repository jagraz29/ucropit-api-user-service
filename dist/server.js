"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const v1_1 = __importDefault(require("./src/routes/v1"));
const app = express();
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocs));
app.use('/v1', v1_1.default);
app.listen(3000, function () {
    console.log('App is listening on port 3000!');
});
//# sourceMappingURL=server.js.map