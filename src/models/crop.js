module.exports = (sequelize, DataTypes) => {
  const Crop = sequelize.define('crops', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    crop_type_id: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    surface: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    quintals: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    tons: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    reference_price: DataTypes.DOUBLE,
    status: {
      type: DataTypes.ENUM,
      defaultValue: 'checking',
      values: ['checking', 'planing', 'accepted']
    }
  },
    {
      freezeTableName: true,
      tableName: 'crops',
      timestamps: true
    }
  )

  return Crop
}