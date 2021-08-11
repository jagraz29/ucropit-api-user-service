/**
 * @swagger
 *  definitions:
 *    lotsGroupedByTagsInActivityObject:
 *      properties:
 *        tag:
 *          type: string
 *        lots:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              lot:
 *                $ref: '#/components/schemas/Lot'
 *              tag:
 *                type: string
 *              surfacePlanned:
 *                type: number
 */
