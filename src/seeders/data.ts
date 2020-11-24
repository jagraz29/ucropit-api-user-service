const mongoose = require('mongoose')

export const supplyTypesData = [
  {
    _id: mongoose.Types.ObjectId('4edd40c86410'),
    name: 'Otros',
    code: 'Otros',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86420'),
    name: 'Fertilizantes agroquimicos',
    code: 'FE',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86421'),
    name: 'Fungicidas agroquimicos',
    code: 'FU',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86422'),
    name: 'Herbicidas agroquimicos',
    code: 'HE',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86423'),
    name: 'Insecticidas agroquimicos',
    code: 'IN',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86430'),
    name: 'Semilla de Pisingallo',
    code: 'SePi',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86431'),
    name: 'Semilla de Maiz',
    code: 'SeMa',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86432'),
    name: 'Semilla de Girasol',
    code: 'SeGi',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86433'),
    name: 'Semilla de Trigo',
    code: 'SeTr',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86434'),
    name: 'Semilla de Soja',
    code: 'SeSo',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86435'),
    name: 'Semilla de Colza',
    code: 'SeCo',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86436'),
    name: 'Semilla de Cebada',
    code: 'SeCe',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('4edd40c86437'),
    name: 'Semilla de Algodon',
    code: 'SeAl',
    icon: 'spa'
  }
]

export const cropTypesData = [
  {
    name: {
      en: 'Soy',
      es: 'Soja'
    },
    key: 'soy'
  },
  {
    name: {
      en: 'Sunflower',
      es: 'Girasol'
    },
    key: 'sunflower'
  },
  {
    name: {
      en: 'Corn',
      es: 'Maiz'
    },
    key: 'corn'
  },
  {
    name: {
      en: 'Cotton',
      es: 'Algodon'
    },
    key: 'cotton'
  },
  {
    name: {
      en: 'Wheat',
      es: 'Trigo'
    },
    key: 'wheat'
  }
]

export const unitTypesData = [
  {
    name: {
      en: 'Kilograms',
      es: 'Kilogramos'
    },
    key: 'kg'
  },
  {
    name: {
      en: 'Tons',
      es: 'Toneladas'
    },
    key: 't'
  },
  {
    name: {
      en: 'Bags',
      es: 'Bolsas'
    },
    key: 'bls'
  },
  {
    name: {
      en: 'Bales',
      es: 'Fardos'
    },
    key: 'fds'
  },
  {
    name: {
      en: 'Quintales',
      es: 'Quintales'
    },
    key: 'q'
  }
]

export const activitiesTypesData = [
  {
    name: {
      en: 'Tillage',
      es: 'Labranza'
    },
    tag: 'ACT_TILLAGE'
  },
  {
    name: {
      en: 'Application',
      es: 'Aplicación'
    },
    tag: 'ACT_APPLICATION'
  },
  {
    name: {
      en: 'Fertilization',
      es: 'Fertilización'
    },
    tag: 'ACT_FERTILIZATION'
  },
  {
    name: {
      en: 'Sowing',
      es: 'Siembra'
    },
    tag: 'ACT_SOWING'
  },
  {
    name: {
      en: 'Harvest',
      es: 'Cosecha'
    },
    tag: 'ACT_HARVEST'
  },
  {
    name: {
      en: 'Agreements',
      es: 'Acuerdos'
    },
    tag: 'ACT_AGREEMENTS'
  },
  {
    name: {
      en: 'TEST',
      es: 'TEST'
    },
    tag: 'TEST'
  }
]

export const agreementTypesData = [
  {
    name: {
      en: 'Commercialization',
      es: 'Comercialización'
    },
    key: 'COMMER'
  },
  {
    name: {
      en: 'financing',
      es: 'Financiación'
    },
    key: 'FINAN'
  },
  {
    name: {
      en: 'Exploitation',
      es: 'Explotación'
    },
    key: 'EXPLO'
  },
  {
    name: {
      en: 'Sustainable cultivation',
      es: 'Cultivo sustentable'
    },
    key: 'SUSTAIN'
  },
  {
    name: {
      en: 'Cotton Best Practices',
      es: 'Algodon Buenas Practicas'
    },
    key: 'COTTON_BETS'
  }
]
