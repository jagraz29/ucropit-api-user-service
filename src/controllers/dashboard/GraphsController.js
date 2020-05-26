'use static'
const CropService = require('../../services/dashboard/crops/CropService')
const CompanyService = require('../../services/dashboard/company/CompanyService')
const SignService = require('../../services/dashboard/signs/SignService')

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

  static async percentSignature(companyId) {
    try {
      const customers = await CompanyService.getCompaniesProductors(companyId)

      const progressRegister = await SignService.summaryRegister(customers)
      const progressSign = await SignService.summarySigned(customers)

      const labels = customers.map(company => {
        return company.name
      })

      const dataSigns = progressSign.map(result => {
        return result.totalSigns[0]
      })

      const dataRegister = progressRegister.map(result => {
        return result.totalRegister[0]
      })


      return {
        labels: labels,
        datasets: [
          {
            ...SINGNED_OPTS,
            data: dataSigns
          },
          {
            ...REGISTERED_OPTS,
            stack: '2',
            data: dataRegister
          }
        ]
      }
    }catch(error) {
      console.log(error)
      throw new Error(error)
    }
  }
}

module.exports = GraphsController
