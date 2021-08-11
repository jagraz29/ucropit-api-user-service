/**
 * @swagger
 *  definitions:
 *    userObject:
 *      properties:
 *        _id:
 *          type: string
 *          format: uuid
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        phone:
 *          type: string
 *        email:
 *          type: string
 *        config:
 *          type: string
 *          format: uuid
 *        companies:
 *         type: array
 *         items:
 *          $ref: '#/definitions/companiesInUserObject'
 *        collaboratorRequest:
 *         type: array
 *         items:
 *          type: string
 *          format: uuid
 */
