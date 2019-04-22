module.exports = (sequelize, DataTypes) => {
  const CropTypes = sequelize.define('CropType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_tons: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    min_tons: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    }
  },
    {
      freezeTableName: true,
      tableName: 'crop_types',
      timestamps: true
    }
  )

  return CropTypes
}