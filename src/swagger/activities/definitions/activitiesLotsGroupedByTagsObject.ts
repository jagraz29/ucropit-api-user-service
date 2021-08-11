/**
 * @swagger
 *  definitions:
 *    activitiesLotsGroupedByTagsObject:
 *      properties:
 *        _id:
 *          type: string
 *          format: uuid
 *        name:
 *          type: string
 *        dateStart:
 *          type: string
 *          format: date
 *        dateEnd:
 *          type: string
 *          format: date
 *        surface:
 *          type: number
 *        key:
 *          type: string
 *        envImpactIndex:
 *          type: string
 *        percentTotal:
 *          type: number
 *        eiq:
 *          type: number
 *        type:
 *          $ref: '#/definitions/activityTypeObject'
 *        status:
 *          type: array
 *          items:
 *            $ref: '#/definitions/statusInActivityObject'
 *        lots:
 *          type: array
 *          items:
 *            $ref: '#/definitions/lotsGroupedByTagsInActivityObject'
 *        supplies:
 *         type: array
 *         items:
 *            $ref: '#/definitions/suppliesInActivityObject'
 *        signers:
 *         type: array
 *         items:
 *            $ref: '#/definitions/signersInActivityObject'
 *        user:
 *          $ref: '#/definitions/userObject'
 *        storages:
 *         type: array
 *         items:
 *          $ref: '#/definitions/storagesObject'
 *        synchronizedList:
 *         type: array
 *         items:
 *          $ref: '#/definitions/synchronizedObject'
 */
