/**
 * @swagger
 *  definitions:
 *    suppliesInActivityObject:
 *      properties:
 *        _id:
 *          type: string
 *          format: uuid
 *        name:
 *          type: string
 *        unit:
 *          type: string
 *        total:
 *          type: number
 *        quantity:
 *          type: number
 *        icon:
 *          type: string
 *        typeId:
 *          $ref: '#/definitions/supplyTypeObject'
 *        supply:
 *          $ref: '#/definitions/supplyInActivityObject'
 */
