/**
 * @swagger
 *  definitions:
 *    supplyInActivityObject:
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
 *          type: string
 *          format: uuid
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
