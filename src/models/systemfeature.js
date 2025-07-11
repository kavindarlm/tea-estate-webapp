'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SystemFeature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Many-to-many relationship with User through UserSystemFeature
      SystemFeature.belongsToMany(models.User, {
        through: models.UserSystemFeature,
        foreignKey: 'system_feature_id',
        otherKey: 'user_id',
        as: 'users'
      });
    }
  }
  SystemFeature.init({
    system_feature_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'SystemFeature',
  });
  return SystemFeature;
};