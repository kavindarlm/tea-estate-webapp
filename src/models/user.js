'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Employee, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      User.hasMany(models.EmployeeWeight, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      User.hasMany(models.Factory, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      User.hasMany(models.TeaWeight, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      User.hasMany(models.FactoryWeight, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      // Many-to-many relationship with SystemFeature through UserSystemFeature
      User.belongsToMany(models.SystemFeature, {
        through: models.UserSystemFeature,
        foreignKey: 'user_id',
        otherKey: 'system_feature_id',
        as: 'systemFeatures'
      });
    }

    // Method to validate password
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

  User.init({
    user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_name: DataTypes.STRING,
    user_email: DataTypes.STRING,
    user_address: DataTypes.STRING,
    user_phone: DataTypes.STRING,
    user_role: DataTypes.STRING,
    user_nic: DataTypes.STRING,
    user_age: DataTypes.INTEGER,
    user_sex: DataTypes.STRING,
    password: DataTypes.STRING,
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
};