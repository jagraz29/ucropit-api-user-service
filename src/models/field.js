module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('fields', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      defaultValue: 'producer',
      values: ['ucropit', 'producer']
    },
    kmz_path: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
    {
      freezeTableName: true,
      tableName: 'fields',
      timestamps: true
    }
  )

  Field.associate = function (models) {
    Field.hasMany(models.lots, { foreignKey: 'field_id' })

    Field.belongsToMany(models.crops, {
      foreignKey: 'field_id',
      otherKey: 'crop_id',
      through: 'crop_field'
    })
  }

  return Field
}