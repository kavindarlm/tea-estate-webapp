'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FactoryWeight extends Model {
    static associate(models) {
      // define association here
      FactoryWeight.belongsTo(models.Factory, {
        foreignKey: 'fac_id',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      FactoryWeight.belongsTo(models.User, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });
    }
  }
  FactoryWeight.init({
    fac_weight_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fac_weight: DataTypes.FLOAT,
    fac_weight_date: DataTypes.DATE,
    fac_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Factory',
        key: 'fac_id'
      }
    },
    created_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'FactoryWeight',
  });
  return FactoryWeight;
};