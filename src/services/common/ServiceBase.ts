import { FileArray } from 'express-fileupload'
import UploadService from '../UploadService'
import ImageService from '../ImageService'
import remove from 'lodash/remove'
import axios from 'axios'
import { fileExist, removeFile } from '../../utils/Files'
import models from '../../models'

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
  public static async addFiles(
    document,
    evidences,
    files: FileArray,
    user,
    path: string
  ) {
    const filesUploaded = await UploadService.upload(files, `${path}`)

    const documents = filesUploaded.map(async (item, index) => {
      const manipulated = await this.manipulateImage(item, path, 500, 500)
      const file = await FileDocument.create({
        ...(item as object),
        ...evidences[index],
        pathThumbnails: manipulated ? manipulated.pathThumbnail : null,
        pathIntermediate: manipulated ? manipulated.pathIntermediate : null,
        user: user._id
      })

      return file._id
    })
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
  public static async removeFiles(fileId: string, document, filePath: string) {
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
  public static async signUser(document, user) {
    const signer = document.signers.filter(
      (item) => item.userId.toString() === user._id.toString()
    )

    if (signer.length > 0) {
      const child = document.signers.id(signer[0]._id)
      child.signed = true
      child.dateSigned = new Date()
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
  public static isCompleteSignsUsers(document): boolean {
    const listNotSigners = document.signers.filter((item) => !item.signed)

    if (listNotSigners.length > 0) {
      return false
    }

    return true
  }

  /**
   * Make Request HTTP.
   *
   * @param method
   * @param url
   * @param values
   * @param callback
   * @param callbackError
   */
  public static makeRequest(
    method: string,
    url: string,
    values: any,
    callback: Function,
    callbackError?: Function
  ) {
    axios[method](url, values).then(callback).catch(callbackError)
  }

  /**
   * Sort based on the value in the monthNames object.
   *
   * @param list
   * @param sortReference
   */
  public static sortData(
    list: Array<any>,
    sortReference?: Array<any>
  ): Array<any> {
    const sortData = list.sort(function (a, b) {
      if (a.total > 0 && b.total > 0){
        let currentDate = a.date.substr(3, 4).split(' ') + a.date.substr(0, 2).split(' ') 
        let cropDate = b.date.substr(3, 4).split(' ') + b.date.substr(0, 2).split(' ') 
        return currentDate - cropDate
      }
    })

    return sortData
  }

  /**
   * Resize image.
   *
   * @param file
   * @param destination
   * @param width
   * @param height
   */

  public static async manipulateImage(
    file,
    destination: string,
    width: number,
    height: number
  ) {
    if (file.fileType.match(VALID_FORMATS_FILES) !== null) {
      const thumbnail = await ImageService.createThumbnail({
        path: file.path,
        destination: `${process.env.DIR_UPLOADS}/${destination}`,
        nameFile: file.nameFile,
        suffixName: 'thumbnail',
        width: 200,
        height: 200,
        fit: 'cover'
      })

      const intermediate = await ImageService.resize({
        path: file.path,
        destination: `${process.env.DIR_UPLOADS}/${destination}`,
        nameFile: file.nameFile,
        suffixName: 'intermediate',
        width: width,
        height: height,
        fit: 'contain'
      })

      return {
        pathThumbnail: thumbnail.path,
        pathIntermediate: intermediate.path
      }
    }

    return null
  }
}

export default ServiceBase
