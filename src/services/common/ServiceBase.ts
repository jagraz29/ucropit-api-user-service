import { FileArray } from 'express-fileupload'
import UploadService from '../UploadService'
import ImageService from '../ImageService'
import remove from 'lodash/remove'
import axios from 'axios'
import { fileExist, removeFile } from '../../utils/Files'
import models from '../../models'
import { array } from 'joi'

const FileDocument = models.FileDocument

const VALID_FORMATS_FILES = `image.*`
class ServiceBase {
  /**
   * Upload Files and create Document Files.
   *
   * @param document
   * @param evidences
   * @param files
   * @param user
   */
  public static async addFiles (
    document,
    evidences,
    files: FileArray,
    user,
    path: string
  ) {
    const filesUploaded = await UploadService.upload(files, `${path}`)

    const documents = filesUploaded.map(async (item, index) => {
      // await ImageService.resize({ path: item.path, width: 200, height: 200 })
      const file = await FileDocument.create({
        ...(item as object),
        ...evidences[index],
        user: user._id
      })

      return file._id
    })

    const manipulateImages = await this.manipulateImage(filesUploaded)

    console.log('Array de imagenes manipuladas')
    console.log(manipulateImages)

    const filesSync = await Promise.all(documents)

    for (const file of filesSync) {
      document.files.push(file)
    }

    return document.save()
  }

  /**
   * Remove Files and DocumentFile.
   *
   * @param fileId
   * @param document
   * @param filePath
   */
  public static async removeFiles (fileId: string, document, filePath: string) {
    if (fileExist(filePath)) {
      removeFile(filePath)

      const fileRemove = await FileDocument.findByIdAndDelete(fileId)

      if (fileRemove) {
        const files = remove(document.files, function (item) {
          return item === fileId
        })

        document.files = files

        await document.save()
      }
      return true
    }

    return false
  }

  /**
   * Sing User.
   *
   * @param document
   * @param user
   */
  public static async signUser (document, user) {
    const signer = document.signers.filter(
      (item) => item.userId.toString() === user._id.toString()
    )

    if (signer.length > 0) {
      const child = document.signers.id(signer[0]._id)
      child.signed = true
    }

    await document.save()
  }

  /**
   * Verify Complete Sign User in the document.
   *
   * @param document
   *
   * @returns boolean
   */
  public static isCompleteSignsUsers (document): boolean {
    const listNotSigners = document.signers.filter((item) => !item.signed)

    if (listNotSigners.length > 0) {
      return false
    }

    return true
  }

  public static makeRequest (
    method: string,
    url: string,
    values: any,
    callback: Function
  ) {
    axios[method](url, values).then(callback)
  }

  /**
   * Sort based on the value in the monthNames object.
   *
   * @param list
   * @param sortReference
   */
  public static sortData (
    list: Array<any>,
    sortReference: Array<any>
  ): Array<any> {
    const sortData = list.sort(function (a, b) {
      return sortReference.indexOf(a.date) - sortReference.indexOf(b.date)
    })

    return sortData
  }

  private static async manipulateImage (files) {
    let fileArray = []
    for (const file of files) {
      if (file.fileType.match(VALID_FORMATS_FILES) !== null) {
        const thumbnail = await ImageService.createThumbnail({
          path: file.path,
          destination: 'uploads/achievements/123-tre',
          nameFile: file.nameFile,
          suffixName: 'thumbnail',
          width: 200,
          height: 200
        })

        const intermediate = await ImageService.resize({
          path: file.path,
          destination: 'uploads/achievements/123-tre',
          nameFile: file.nameFile,
          suffixName: 'intermediate',
          width: 350,
          height: 350
        })

        fileArray.push({
          path: thumbnail.path,
          nameFile: thumbnail.nameFile,
          fileType: file.fileType
        })

        fileArray.push({
          path: intermediate.path,
          nameFile: intermediate.nameFile,
          fileType: file.fileType
        })
      }
    }

    return fileArray
  }
}

export default ServiceBase
