/**
 * @swagger
 *  definitions:
 *    achievementObject :
 *      properties:
 *        _id:
 *          type: string
 *          format: uuid
 *        dateAchievement:
 *          type: string
 *          format: date
 *        surface:
 *          type: number
 *        key:
 *          type: string
 *        envImpactIndex:
 *          type: string
 *          format: uuid
 *        percent:
 *          type: number
 *        eiq:
 *          type: number
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
 *        destination:
 *         type: array
 *         items:
 *          $ref: '#/definitions/destinationObject'
 *        synchronizedList:
 *         type: array
 *         items:
 *          $ref: '#/definitions/synchronizedObject'
 *        files:
 *          type: array
 *          items:
 *            $ref: '#/definitions/fileObject'
 */
