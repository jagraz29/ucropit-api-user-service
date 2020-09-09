import models from '../models'
import FileUpload from './FileUpload'
import _ from 'lodash'

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

  public static async addFiles (activity, files, user) {
    const store = new FileUpload(
      files,
      `uploads/activities/${_.kebabCase(activity.name)}`
    )

    const filesUploaded = await store.save()

    const documents = filesUploaded.map(async (item) => {
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
}

export default ActivityService
