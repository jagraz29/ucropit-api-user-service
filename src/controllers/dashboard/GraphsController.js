'use static'

const _ = require('lodash')
const Common = require('../../services/approvalRegisters/Common')
const CropService = require('../../services/dashboard/crops/CropService')
const CompanyService = require('../../services/dashboard/company/CompanyService')
const SignService = require('../../services/dashboard/signs/SignService')
const CropTypes = require('../../models').crop_types

const SINGNED_OPTS = {
  label: 'Firmadas',
  backgroundColor: '#5FD856',
  stack: '1',
}

const REGISTERED_OPTS = {
  label: 'A Registrar',
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

  static async percentSignature(companyId) {
    try {
      const customers = await CompanyService.getCompaniesProductors(companyId)

      const labels = customers.map(company => {
        return company.name
      })

      console.log(labels)

      SignService.summary(customers)

      // {
      //   labels: ['Algodón', 'Soja', 'Maiz', 'Girasol'],
      //   datasets: [
      //     {
      //       label: 'Firmadas',
      //       backgroundColor: '#5FD856',
      //       stack: '1',
      //       data: [30, 50, 20, 40, 50, 30, 20, 110]
      //     },
      //     {
      //       label: 'Registradas',
      //       backgroundColor: '#ccc',
      //       stack: '2',
      //       data: [10, 0, 5, 15, 0, 4, 8, 8]
      //     }
      //   ]
      // }
    }catch(error) {
      console.log(error)
      throw new Error(error)
    }
  }
}

module.exports = GraphsController
