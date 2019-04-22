module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('fields', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      defaultValue: 'own',
      values: ['own', 'third']
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

  return Field
}