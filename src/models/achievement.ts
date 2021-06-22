import { model } from 'mongoose'
import shortid from 'shortid'
import { IAchievementDocument } from '../interfaces'
import { AchievementSchema } from '../schemas'

AchievementSchema.pre('save',  (next: Function) => {
  const achievement: any = this

  /** Generate unique key */
  if (!achievement.key) {
    achievement.key = shortid.generate()
  }
  next()
})

export const AchievementModel = model<IAchievementDocument>('Achievement', AchievementSchema)
