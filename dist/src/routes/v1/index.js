"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const router = express_1.default.Router();
/**
 * @swagger
 * /v1:
 *  get:
 *   description: Test endpoint
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: A status of API
 */
router.get('/', (req, res) => {
    res.send('v1 APP OK');
});
router.use('/users', users_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map