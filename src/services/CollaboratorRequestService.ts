import models from '../models'

const CollaboratorRequest = models.CollaboratorRequest

interface ICollaboratorRequest {
  status?: string
  user?: string
  company?: string
}

class CollaboratorRequestService {
  /**
   * Find Collaborator request by query filter.
   *
   * @param Object query
   */
  public static async find(query) {
    return CollaboratorRequest.find(query).populate('user').populate('company')
  }

  /**
   * Find Collaborator request by id.
   *
   * @param string id
   */
  public static async findById(id: string) {
    return CollaboratorRequest.findById(id).populate('user').populate('company')
  }

  /**
   * Update collaborator request.
   *
   * @param ICollaboratorRequest collaboratorRequest
   * @param string id
   */
  public static async update(
    collaboratorRequest: ICollaboratorRequest,
    id: string
  ) {
    return CollaboratorRequest.findByIdAndUpdate(id, collaboratorRequest)
  }
}

export default CollaboratorRequestService
