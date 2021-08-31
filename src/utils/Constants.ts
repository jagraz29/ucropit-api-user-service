export const tagsTypeAgreement = {
  SUSTAIN: 'SUSTAIN',
  EXPLO: 'EXPLO'
}

export const defaultLanguageConfig = { language: 'es', region: 'AR' }

export const VALID_FORMATS_FILES_IMAGES_PNG = 'png'
export const VALID_FORMATS_FILES_IMAGES_JPG = 'jpg|jpeg'
export const VALID_FORMATS_FILES_DOCUMENTS = 'pdf'

export const ACTIVITY_HARVEST = 'ACT_HARVEST'

export const SENSING_REMOTE_URL = `${process.env.SERVICE_REMOTE_SENSING_URL}`
export const SENSING_ENDPOINT_REQUEST = `${process.env.ENDPOINT_REQUEST}`

export const responsibleRoles = [
  'PRODUCER',
  'PRODUCER_ADVISER',
  'PRODUCER_ADVISER_ENCOURAGED'
]

export const rolesAdvisorPromoter = ['PRODUCER_ADVISER_ENCOURAGED']

export const typesSupplies = [
  {
    tag: 'ACT_HARVEST',
    value: 'harvest',
    codes: [],
    types: []
  },
  {
    tag: 'ACT_SOWING',
    value: 'sowing',
    codes: [
      'SeMa',
      'SeGi',
      'SeTr',
      'SeSo',
      'SeCo',
      'SeCe',
      'SeAl',
      'SeCa',
      'SeAv',
      'SeSor',
      'SeRa',
      'SeAr',
      'SeMn',
      'Otros',
      'FE',
      'FU',
      'HE',
      'SePi',
      'SeCen',
      'SeArr'
    ],
    types: [
      '346564643430633836343331', //SeMa
      '346564643430633836343332', //SeGi
      '346564643430633836343333', //SeTr
      '346564643430633836343334', //SeSo
      '346564643430633836343335', //SeCo
      '346564643430633836343336', //SeCe
      '346564643430633836343337', //SeAl
      '604a66451780599686eda512', //SeCa
      '60eed6e405d460bdb6dd8d38', //SeAv
      '60eed66c05d460bdb6dd8cc3', //SeSor
      '60eed6c105d460bdb6dd8d1a', //SeRa
      '60eed79c05d460bdb6dd8e24', //SeAr
      '60f9951b05d460bdb6e9c3b5', //SeMn
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233', //IN
      '346564643430633836343330', //SePi
      '6103f3c005d460bdb6f65448', //SeCen
      '6103f3dd05d460bdb6f65462' //SeCen
    ]
  },
  {
    tag: 'ACT_APPLICATION',
    value: 'application',
    codes: ['Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    tag: 'ACT_FERTILIZATION',
    value: 'fertilization',
    codes: ['Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    tag: 'ACT_TILLAGE',
    value: 'tillage',
    codes: ['Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    tag: 'ACT_AGREEMENTS',
    value: 'agreements',
    codes: [],
    types: []
  },
  {
    tag: 'ACT_MONITORING',
    value: 'monitoring',
    codes: [],
    types: []
  }
]

export const SupplyTypeByCropType = [
  {
    key: 'soy',
    codes: ['SeSo', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343334', //SeSo
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'sunflower',
    codes: ['SeGi', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343332', //SeGi
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'corn',
    codes: ['SeMa', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343331', //SeMa
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'cotton',
    codes: ['SeAl', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343337', //SeAl
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'wheat',
    codes: ['SeTr', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343333', //SeTr
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'Carinata',
    codes: ['SeCa', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '604a66451780599686eda512', //SeCa
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'oatmeal',
    codes: ['SeAv', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '60eed6e405d460bdb6dd8d38', //SeAv
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'sorghum',
    codes: ['SeSor', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '60eed66c05d460bdb6dd8cc3', //SeSor
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'rye-grass',
    codes: ['SeRa', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '60eed6c105d460bdb6dd8d1a', //SeRa
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'vetch',
    codes: ['SeAr', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '60eed79c05d460bdb6dd8e24', //SeAr
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'Barley',
    codes: ['SeCe', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343336', //SeCe
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'Colza',
    codes: ['SeCo', 'Otros', 'FE', 'FU', 'HE', 'IN'],
    types: [
      '346564643430633836343335', //SeCo
      '346564643430633836343130', //Otros
      '346564643430633836343230', //FE
      '346564643430633836343231', //FU
      '346564643430633836343232', //HE
      '346564643430633836343233' //IN
    ]
  },
  {
    key: 'Rice',
    codes: ['SeArr'],
    types: [
      '6103f3dd05d460bdb6f65462' //SeArr
    ]
  },
  {
    key: 'Rye',
    codes: ['SeCen'],
    types: [
      '6103f3c005d460bdb6f65448' //SeCen
    ]
  },
  {
    key: 'Peanut',
    codes: ['SeMn'],
    types: [
      '60f9951b05d460bdb6e9c3b5' //SeMn
    ]
  },
  {
    codes: ['SePi'],
    types: [
      '346564643430633836343330' //SePi
    ]
  }
]

export const supplyTypesSeedGen = [
  '346564643430633836343330', //SePi
  '346564643430633836343331', //SeMa
  '346564643430633836343332', //SeGi
  '346564643430633836343333', //SeTr
  '346564643430633836343334', //SeSo
  '346564643430633836343335', //SeCo
  '346564643430633836343336', //SeCe
  '346564643430633836343337' //SeAl
]

export const supplyTypesSeedGenCodes = [
  'SePi',
  'SeMa',
  'SeGi',
  'SeTr',
  'SeSo',
  'SeCo',
  'SeCe',
  'SeAl'
]

export const supplyTypesEIQ = [
  '346564643430633836343130', //Otros
  '346564643430633836343231', //FU
  '346564643430633836343232', //HE
  '346564643430633836343233' //IN
]

export const supplyTypesEIQCodes = ['Otros', 'FU', 'HE', 'IN']
