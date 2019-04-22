module.exports = (sequelize, DataTypes) => {
  const Lot = sequelize.define('lots', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    field_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    surface: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    kmz_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
    {
      freezeTableName: true,
      tableName: 'lots',
      timestamps: true
    }
  )

  return Lot
}