'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: { allowNull: false, type: DataTypes.STRING, unique: true },
    password: { allowNull: false, type: DataTypes.STRING },
    phone: { allowNull: false, type: DataTypes.STRING },
    first_name: { allowNull: false, type: DataTypes.STRING },
    last_name: { allowNull: false, type: DataTypes.STRING },
    fiscal_id: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};