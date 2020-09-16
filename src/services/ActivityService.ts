import models from '../models'
import FileUpload from './FileUpload'
import { fileExist, removeFile } from '../utils/Files'
import kebabCase from 'lodash/kebabCase'
import remove from 'lodash/remove'

const Activity = models.Activity
const FileDocument = models.FileDocument

interface IActivity {
  name: String
  dateStart: String
  dateEnd: String
  surface: Number
  type: String
  crop: String
  lots?: Array<any>
  supplies?: Array<any>
}
class ActivityService {
  public static async store (activity: IActivity) {
    return Activity.create(activity)
  }

  public static async update (id, activity: IActivity) {
    await Activity.findByIdAndUpdate(id, activity)

    return Activity.findOne({ _id: id })
  }

  public static async addFiles (activity, files, user) {
    const store = new FileUpload(
      files,
      `${process.env.DIR_UPLOADS}/activities/${kebabCase(activity.name)}`
    )

    const filesUploaded = await store.save()

    const documents = filesUploaded.map(async item => {
      const file = await FileDocument.create({
        ...item,
        date: new Date(),
        user: user._id
      })

      return file._id
    })

    activity.files = await Promise.all(documents)

    return activity.save()
  }

  public static async removeFiles (fileId: string, activity, filePath: string) {
    if (fileExist(filePath)) {
      removeFile(filePath)

      const fileRemove = await FileDocument.findByIdAndDelete(fileId)

      if (fileRemove) {
        const files = remove(activity.files, function (item) {
          return item === fileId
        })

        activity.files = files

        await activity.save()
      }
      return true
    }

    return false
  }
}

export default ActivityService
