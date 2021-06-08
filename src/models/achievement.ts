import { model } from 'mongoose'
import shortid from 'shortid'
import { IAchievementDocument } from '../interfaces'
import { AchievementSchema } from '../schemas'

AchievementSchema.pre('save', async (next: Function) => {
  const achievement = this

  /** Generate unique key */
  if (!achievement.key) {
    achievement.key = shortid.generate()
  }
})

export const AchievementModel = model<IAchievementDocument>('Achievement', AchievementSchema)
