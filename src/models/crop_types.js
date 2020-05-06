module.exports = (sequelize, DataTypes) => {
  const CropTypes = sequelize.define('crop_types', {
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
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      get: function() {
        return `${process.env.BASE_URL}/croptypes/${this.getDataValue('image')}`;
      }
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