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
  },
  {
    _id: mongoose.Types.ObjectId('60eed6e405d460bdb6dd8d38'),
    name: 'Semilla de Avena',
    code: 'SeAv',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('60eed66c05d460bdb6dd8cc3'),
    name: 'Semilla de Sorgo',
    code: 'SeSo',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('60eed6c105d460bdb6dd8d1a'),
    name: 'Semilla de Raigrás',
    code: 'SeRa',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('60eed79c05d460bdb6dd8e24'),
    name: 'Semilla de Arveja',
    code: 'SeAr',
    icon: 'spa'
  },
  {
    _id: mongoose.Types.ObjectId('60f9951b05d460bdb6e9c3b5'),
    name: 'Semilla de Maní',
    code: 'SeMn',
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
  },
  {
    name: {
      en: 'Oatmeal',
      es: 'Avena'
    },
    key: 'oatmeal'
  },
  {
    name: {
      en: 'Sorghum',
      es: 'Sorgo'
    },
    key: 'sorghum'
  },
  {
    name: {
      en: 'Ryegrass',
      es: 'Raigrás'
    },
    key: 'ryegrass'
  },
  {
    name: {
      en: 'Vetch',
      es: 'Arveja'
    },
    key: 'vetch'
  },
  {
    name: {
      en: 'Peanut',
      es: 'Maní'
    },
    key: 'peanut'
  }
]

export const unitTypesData = [
  {
    name: {
      en: 'Kilograms/ha',
      es: 'Kilogramos/ha'
    },
    key: 'kg'
  },
  {
    name: {
      en: 'Tons/ha',
      es: 'Toneladas/ha'
    },
    key: 't'
  },
  {
    name: {
      en: 'Bags/ha',
      es: 'Bolsas/ha'
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
      en: 'Quintales/ha',
      es: 'Quintales/ha'
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
      en: 'Monitoring',
      es: 'Monitoreo'
    },
    tag: 'ACT_MONITORING'
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
  },
  {
    name: {
      en: 'Supplies',
      es: 'Proveedor'
    },
    key: 'SUPPLIER'
  },
  {
    name: {
      en: 'Responsible use of Phytosanitary',
      es: 'Uso responsable de Fitosanitarios'
    },
    key: 'RESPONSIBLE_USE'
  }
]

export const evidenceConcepts = [
  {
    code: '0001',
    name: {
      en: 'Waybill',
      es: 'Carta de porte'
    }
  },
  {
    code: '0002',
    name: {
      en: 'Supporting Documentation',
      es: 'Documentación de Respaldo'
    }
  },
  {
    code: '0003',
    name: {
      en: 'Bill',
      es: 'Factura'
    }
  },
  {
    code: '0004',
    name: {
      en: 'Photo inside the Lot',
      es: 'Foto dentro del Lote'
    }
  },
  {
    code: '0005',
    name: {
      en: 'Agricultural recipe',
      es: 'Receta agropecuaria'
    }
  },
  {
    code: '0006',
    name: {
      en: 'Dispatch Form',
      es: 'Remito'
    }
  },
  {
    code: '0007',
    name: {
      en: 'Seeds Bill',
      es: 'Factura Semillas'
    }
  },
  {
    code: '0008',
    name: {
      en: 'Seed Royalties',
      es: 'Facturas Regalias'
    }
  },
  {
    code: '0009',
    name: {
      en: 'Satellite Image',
      es: 'Imagen Satelital'
    }
  }
]

export const servicesIntegration = [
  {
    code: 'AURAVANT',
    name: 'Auravant',
    description:
      'Es agricultura digital simple. Es innovación tecnológica que potencia el conocimiento agronómico y maximiza los resultados',
    conditions: [
      'actualizaciones específicas sobre los riesgos de enfermedades e insectos para los cultivos',
      'notificaciones importantes sobre la fase de crecimiento de los cultivos',
      'notificaciones sobre el momento óptimo de fumigación',
      'notificaciones sobre mapas de biomasa disponibles',
      'información meteorológica específica para cada campo',
      'predicción meteorológica por hora'
    ],
    erpAgent: 'auravant'
  }
]

export const rolesData = [
  {
    label: {
      en: 'Advisor',
      es: 'Asesor'
    },
    value: 'PRODUCER_ADVISER'
  },
  {
    label: {
      en: 'Advisor promoter',
      es: 'Asesor promotor'
    },
    value: 'PRODUCER_ADVISER_ENCOURAGED'
  },
  {
    label: {
      en: 'Producer',
      es: 'Productor'
    },
    value: 'PRODUCER'
  },
  {
    label: {
      en: 'Provider',
      es: 'Proveedor'
    },
    value: 'PROVIDER'
  },
  {
    label: {
      en: 'Marketer',
      es: 'Comercializador'
    },
    value: 'MARKETER'
  },
  {
    label: {
      en: 'KAM',
      es: 'KAM'
    },
    value: 'CAM'
  },
  {
    label: {
      en: 'Commercial contact',
      es: 'Contacto comercial'
    },
    value: 'CONTACT_REPRESENTATIVE',
    isInactive: true
  }
]

export const storageTypes = [
  {
    name: {
      en: 'Silobags',
      es: 'Silobolsas'
    },
    key: 'SILO_BAG'
  },
  {
    name: {
      en: 'Silo',
      es: 'Silo'
    },
    key: 'SILO'
  },
  {
    name: {
      en: 'Out of program delivery',
      es: 'Entrega fuera de programa'
    },
    key: 'DELIVERY_OUT_OF_PROGRAM'
  },
  {
    name: {
      en: 'Delivery within the program',
      es: 'Entrega dentro de programa'
    },
    key: 'DELIVERY_WITHIN_OF_PROGRAM'
  }
]

export const foreignCredentials = [
  {
    credentialKey: 'sensing',
    credentialSecret: 'sensing-secret'
  }
]
