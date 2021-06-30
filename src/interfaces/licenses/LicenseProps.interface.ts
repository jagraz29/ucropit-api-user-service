import { LicenseTypes, LicenseStatus } from '.'
export interface ILicenseProps {
  name: string
  type: LicenseTypes
  previewDescription: string
  companyId: string
  companyIdentifier?: string
  cropType: string
  termsAndConditions: string
  clauses: string[]
  accessibleIdentifier: string[]
  startDatePost: Date
  endDatePost: Date
  startDate: Date
  endDate: Date
  companyUsers: string[]
  userViewCounter?: number
  status?: LicenseStatus
  hectareLimit: number
  hectareLimitIdentifier?: number
  timeLeftPost: number
  timeLeftNew: number
  hectareUsedCounter?: number
  hectareLeftPercentage: number
  image?: string
  imageKey?: string
}
