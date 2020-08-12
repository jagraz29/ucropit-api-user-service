import express from 'express'
import FileUpload from '../../services/FileUpload'

const router: express.Router = express.Router()

router.post('/files', async (request, response) => {
  const upload = new FileUpload(request.files, 'uploads')

  await upload.store()
})

export default router
