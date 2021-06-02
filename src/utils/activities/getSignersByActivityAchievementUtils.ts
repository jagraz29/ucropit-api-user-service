import { roles, Signer } from '../../interfaces'
export const getSignerList = (signers: Signer[], members) => {
  return signers.map(
    ({ userId, fullName, email, dateSigned, signed }: Signer) => {
      const member = members.find(
        ({ user }) => userId.toString() === user._id.toString()
      )

      return {
        fullName,
        email,
        dateSigned,
        signed,
        rol: roles[member.type] || '',
        cuit: member.cuit
      }
    }
  )
}
