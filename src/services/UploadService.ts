import FileUpload from './FileUpload'

interface IStore {
  path: string
  nameFile: string
  fileType: string
}

class UploadService {
  public static async upload (files, direction: string): Promise<Array<IStore>> {
    const store = new FileUpload(
      files,
      `${process.env.DIR_UPLOADS}/${direction}`
    )

    return store.save()
  }
}

export default UploadService
