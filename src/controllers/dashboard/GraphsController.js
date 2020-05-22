'use static'

const _ = require('lodash')
const ProductionPermission = require('../../services/production/ProductionPermissions')
const CropService = require('../../services/dashboard/crops/CropService')
const CropTypes = require('../../models').crop_types

const SINGNED_OPTS = {
  label: 'Firmado',
  backgroundColor: '#5FD856',
  stack: '1',
}

const REGISTERED_OPTS = {
  label: 'Registrado',
  backgroundColor: '#FFD101',
  stack: '1',
}

const TO_REGISTER_OPTS = {
  label: 'A Registrar',
  backgroundColor: '#ccc',
  stack: '2',
}


class GraphsController {
  static async surfacePerCrop(req, res) {
    const registeredSurfaces = await CropService.getCropRegisteredSurfacesBy({
      company: req.params.companyId,
    })

    console.log(
      await ProductionPermission.whoCanSign('field')
    )

    res.json({
      labels: registeredSurfaces.map((el) => el.name),
      datasets: [
        {
          ...SINGNED_OPTS,
          data: [30, 50, 20, 40],
        },
        {
          ...TO_REGISTER_OPTS,
          data: registeredSurfaces.map((el) => el.surface),
        },
      ],
    })
  }
}

module.exports = GraphsController
