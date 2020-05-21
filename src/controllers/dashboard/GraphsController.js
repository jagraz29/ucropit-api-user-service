'use static'

const _ = require('lodash')
const Common = require('../../services/approvalRegisters/Common')
const CropService = require('../../services/dashboard/crops/CropService')
const CropTypes = require('../../models').crop_types

const SINGNED_OPTS = {
  label: 'Firmadas',
  backgroundColor: '#5FD856',
  stack: '1',
}

const REGISTERED_OPTS = {
  label: 'Registradas',
  backgroundColor: '#ccc',
  stack: '1',
}

class GraphsController {
  static async surfacePerCrop(req, res) {
    const registeredSurfaces = await CropService.getCropRegisteredSurfacesBy({
      company: req.params.companyId,
    })

    res.json({
      labels: registeredSurfaces.map((el) => el.name),
      datasets: [
        {
          ...SINGNED_OPTS,
          data: [30, 50, 20, 40],
        },
        {
          ...REGISTERED_OPTS,
          data: registeredSurfaces.map((el) => el.surface),
        },
      ],
    })
  }
}

module.exports = GraphsController
