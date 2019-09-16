"use strict";

module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define(
    "providers",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("Sugerido", "Completo", "Validado"),
        allowNull: false,
        defaultValue: "Sugerido"
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cellphone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      estate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      taxid: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cbu: {
        type: DataTypes.STRING,
        allowNull: false
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
        get: function() {
          return `${process.env.BASE_URL}/providers/${this.getDataValue(
            "photo"
          )}`;
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      discounts: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      web: {
        type: DataTypes.STRING,
        allowNull: true
      },
      workplace: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  Provider.associate = function(models) {
    Provider.belongsToMany(models.providers_type, {
      through: "providers_providers_type",
      foreignKey: "providers_id",
      otherKey: "providers_type_id"
    });

    Provider.belongsToMany(models.coverage_areas, {
      through: "coverage_areas_providers",
      foreignKey: "providers_id",
      otherKey: "coverage_area_id"
    });

    Provider.belongsToMany(models.users, {
      through: "providers_users",
      foreignKey: "providers_id",
      otherKey: "user_id"
    });
  };

  return Provider;
};
