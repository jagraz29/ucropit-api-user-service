export interface Signer {
  _id: string
  userId: string
  fullName?: string
  email: string
  type: string
  signed?: boolean
}
