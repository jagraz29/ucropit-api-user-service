import { model } from 'mongoose'
import { IEiqRanges } from '../interfaces'
import { EiqRangesSchema } from '../schemas'

export const EiqRangesModel = model<IEiqRanges>('EiqRanges', EiqRangesSchema)
