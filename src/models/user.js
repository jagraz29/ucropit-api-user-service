const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        message: 'El email del usuario ya existe',
        allowNull: false
      },
      first_login: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
      },
      password: {
        type: DataTypes.STRING
      },
      fiscal_number: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      tableName: "users",
      timestamps: true
    }
  );

  User.associate = function(models) {
    User.hasMany(models.signs, {
      foreignKey: "user_id"
    });

    User.belongsToMany(models.providers, {
      through: "providers_users",
      foreignKey: "user_id",
      otherKey: "providers_id"
    });

    User.belongsToMany(models.users, {
      through: "diary_users",
      as: 'ContactUser'
    });
  };

  async function encryptPasswordIfChanged(user, options) {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.beforeCreate(encryptPasswordIfChanged);
  User.beforeUpdate(encryptPasswordIfChanged);

  return User;
};
