module.exports = (sequelize, DataTypes) => {
  const Lot = sequelize.define(
    'lots',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      surface: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      kmz_path: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      area: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      crop_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      tableName: 'lots',
      timestamps: true
    }
  );

  Lot.associate = function(models) {
    Lot.belongsTo(models.crop_types, { foreignKey: 'crop_type_id' });
  };

  return Lot;
};
