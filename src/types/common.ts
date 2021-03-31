export const roles = ['MARKETER', 'PROVIDER', 'CAM']

export const errors = [
  { key: '001', code: 'NOT_AUTHORIZATION_EXPORT' },
  { key: '002', code: 'ERROR_KMZ_INVALID_FORMAT' },
  { key: '003', code: 'ERROR_FILE_EXTENSION' },
  { key: '004', code: 'NAME_LOT_DUPLICATED' }
]

export enum emailTemplates {
  NOTIFICATION_COLLABORATOR = 'notification-collab',
  NOTIFICATION_ACTIVITY = 'notification-activity'
}
