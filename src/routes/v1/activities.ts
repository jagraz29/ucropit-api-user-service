import express from 'express'

import activitiesController from '../../controllers/ActivitiesController'

const router: express.Router = express.Router()

router.get('/', activitiesController.index)

router.get('/:id', activitiesController.show)

router.post('/', activitiesController.store)

router.delete('/:id', activitiesController.delete)

export default router
