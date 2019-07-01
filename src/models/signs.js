'use strict';
module.exports = (sequelize, DataTypes) => {
  const signs = sequelize.define('signs', {
    type: DataTypes.STRING,
    type_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    hash: DataTypes.TEXT,
    ots: DataTypes.TEXT,
    meta: DataTypes.TEXT,
    status: DataTypes.BOOLEAN
  }, {});
  signs.associate = function(models) {
    // associations can be defined here
  };
  return signs;
};