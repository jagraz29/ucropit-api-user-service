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
 *          $ref: '#/definitions/activeIngredientsObject'
 */
