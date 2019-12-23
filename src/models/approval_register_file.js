"use strict";
module.exports = (sequelize, DataTypes) => {
  const approval_register_file = sequelize.define(
    "approval_register_file",
    {
      approval_register_id: DataTypes.INTEGER,
      path: {
        type: DataTypes.STRING,
        get: function() {
          return `${process.env.BASE_URL}/uploads/${this.getDataValue(
            "path"
          )}`;
        }
      },
      concept: DataTypes.STRING,
      type: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING
    },
    {}
  );
  approval_register_file.associate = function(models) {
    approval_register_file.belongsTo(models.users, { foreignKey: 'user_id' })
  };
  return approval_register_file;
};
