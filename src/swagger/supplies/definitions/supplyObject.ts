/**
 * @swagger
 *  definitions:
 *    supplyObject:
 *      properties:
 *        _id:
 *          type: string
 *          format: uuid
 *        name:
 *          type: string
 *        company:
 *          type: string
 *        code:
 *          type: string
 *        typeId:
 *          $ref: '#/components/schemas/SupplyTypes'
 *        brand:
 *         type: string
 *        compositon:
 *         type: string
 *        eiqTotal:
 *           type: number
 *           format: double
 *        activeIngredients:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               format: uuid
 *             activeIngredient:
 *               type: string
 *               format: uuid
 *             eiqActiveIngredient:
 *               type: number
 *               format: integer
 *             compositon:
 *               type: number
 *               format: double
 *             eiq:
 *               type: number
 *               format: double
 */
