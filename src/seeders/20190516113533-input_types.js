'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('input_types', [
        {
          "id": 60,
          "code": "SB",
          "name": "Silobolsas",
          "image": "herb.svg"
        },
        {
          "id": 61,
          "code": "Otros",
          "name": "Otros",
          "image": "herb.svg"
        },
        {
          "id": 62,
          "code": "FE",
          "name": "Fertilizantes agroquimicos",
          "image": "herb.svg"
        },
        {
          "id": 63,
          "code": "FU",
          "name": "Fungicidas agroquimicos",
          "image": "herb.svg"
        },
        {
          "id": 64,
          "code": "HE",
          "name": "Herbicidas agroquimicos",
          "image": "herb.svg"
        },
        {
          "id": 65,
          "code": "IN",
          "name": "Insecticidas agroquimicos",
          "image": "herb.svg"
        },
        {
          "id": 66,
          "code": "SePi",
          "name": "Semilla de Pisingallo",
          "image": "herb.svg"
        },
        {
          "id": 74,
          "code": "SeMa",
          "name": "Semilla de Maiz",
          "image": "herb.svg"
        },
        {
          "id": 75,
          "code": "SeGi",
          "name": "Semilla de Girasol",
          "image": "herb.svg"
        },
        {
          "id": 76,
          "code": "SeTr",
          "name": "Semilla de Trigo",
          "image": "herb.svg"
        },
        {
          "id": 77,
          "code": "SeSo",
          "name": "Semilla de Soja",
          "image": "herb.svg"
        },
        {
          "id": 78,
          "code": "SeCo",
          "name": "Semilla de Colza",
          "image": "herb.svg"
        },
        {
          "id": 79,
          "code": "SeCe",
          "name": "Semilla de Cebada",
          "image": "herb.svg"
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('input_types', null, {});
  }
};
