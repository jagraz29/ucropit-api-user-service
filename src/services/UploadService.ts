import { FileArray } from 'express-fileupload'
import FileUpload from './FileUpload'

class UploadService {
  public static async upload (files: FileArray, direction: string) {
    const store = new FileUpload(files, `${direction}`)
    return store.store()
  }
}

export default UploadService
