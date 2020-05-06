'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('inputs', [
      {
        'unit_id': 17,
        'type_id': 60,
        'code': 'SB001',
        'name': 'Silobolsa 60 mts',
        'stage': 'all'
      },
      {
        'unit_id': 7,
        'type_id': 60,
        'code': 'SB002',
        'name': 'Silobolsa 75 mts',
        'stage': 'all'
      },
      {
        'unit_id': 17,
        'type_id': 61,
        'code': 'DI001',
        'name': 'Bls plastilleras x 40 kgs',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 77,
        'code': 'SO049',
        'name': 'Semilla Soja',
        'stage': 'all'
      },
      {
        'unit_id': 22,
        'type_id': 62,
        'code': 'FE002',
        'name': 'Biagro adhesivo S1',
        'stage': 'all'
      },
      {
        'unit_id': 22,
        'type_id': 62,
        'code': 'FE003',
        'name': 'Biagro aditivo S2',
        'stage': 'all'
      },
      {
        'unit_id': 22,
        'type_id': 62,
        'code': 'FE004',
        'name': 'Biagro B10',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE005',
        'name': 'Biagro Fungicida',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE006',
        'name': 'Biagro Liquido',
        'stage': 'all'
      },
      {
        'unit_id': 22,
        'type_id': 62,
        'code': 'FE007',
        'name': 'Biagro S3',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE008',
        'name': 'CAN',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE009',
        'name': 'Cloruro de potasio',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE010',
        'name': 'DAP',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE011',
        'name': 'Foliarsol',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE012',
        'name': 'MAP',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE013',
        'name': 'MAP - S',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE014',
        'name': 'Mezcla',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE015',
        'name': 'Nitragin Bonus',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE016',
        'name': 'Nitragin CellTech',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE017',
        'name': 'Nitragin Optimize',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE018',
        'name': 'Nitragin Power',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE019',
        'name': 'Nitragin Protreat',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE020',
        'name': 'Nitrap Max',
        'stage': 'all'
      },
      {
        'unit_id': 17,
        'type_id': 75,
        'code': 'GI035',
        'name': 'Semilla Girasol',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE022',
        'name': 'Rizo Liq',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE023',
        'name': 'Rizo Liq Max',
        'stage': 'all'
      },
      {
        'unit_id': 21,
        'type_id': 62,
        'code': 'FE024',
        'name': 'Rizo Pac',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 62,
        'code': 'FE025',
        'name': 'Rizo Premax',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE026',
        'name': 'S 10',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE027',
        'name': 'SPT',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE028',
        'name': 'SPS',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE029',
        'name': 'Sulfato de Amonio',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE030',
        'name': 'Sulfato de Calcio',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE031',
        'name': 'UAN',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE032',
        'name': 'UAN-S',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE033',
        'name': 'Urea',
        'stage': 'all'
      },
      {
        'unit_id': 18,
        'type_id': 62,
        'code': 'FE034',
        'name': 'Urea-S',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU001',
        'name': 'Acronis',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU002',
        'name': 'Allegro',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU003',
        'name': 'Amistar top',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU004',
        'name': 'Amistar Xtra',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU005',
        'name': 'Apron gold',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU006',
        'name': 'Caramba',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU007',
        'name': 'Carbendazim',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU008',
        'name': 'Chucaro',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU009',
        'name': 'Comet',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU010',
        'name': 'Duett',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU011',
        'name': 'Folicur',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU012',
        'name': 'Nativo',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU013',
        'name': 'Opera',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU014',
        'name': 'Premis',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU015',
        'name': 'Pucara Curasemilla',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU016',
        'name': 'Quilt',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU017',
        'name': 'Ritiram Carb',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU018',
        'name': 'Rovral',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU019',
        'name': 'Scenic',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU020',
        'name': 'Sphere max',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU021',
        'name': 'Stinger',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 63,
        'code': 'FU022',
        'name': 'Tiram',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE001',
        'name': '2.4 D',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE002',
        'name': '2.4 D Amina',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE003',
        'name': '2.4 DB',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE004',
        'name': 'Aceite Agricola',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE005',
        'name': 'Aceite D Plus',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE006',
        'name': 'Acetoclor',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE007',
        'name': 'Affinity',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE008',
        'name': 'Agil',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE009',
        'name': 'Alteza',
        'stage': 'all'
      },
      {
        'unit_id': 19,
        'type_id': 64,
        'code': 'HE010',
        'name': 'Antideriva',
        'stage': 'all'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('inputs', null, {});
  }
};
