'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSystemFeature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Belongs to User
      UserSystemFeature.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      // Belongs to SystemFeature
      UserSystemFeature.belongsTo(models.SystemFeature, {
        foreignKey: 'system_feature_id',
        as: 'systemFeature'
      });
    }
  }
  UserSystemFeature.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    system_feature_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SystemFeature',
        key: 'system_feature_id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserSystemFeature',
  });
  return UserSystemFeature;
};