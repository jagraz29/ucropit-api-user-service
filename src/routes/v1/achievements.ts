import express from 'express'
import achievementsController from '../../controllers/AchievementsController'

const router: express.Router = express.Router()

router.post('/', achievementsController.create)

export default router
