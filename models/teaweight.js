'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeaWeight extends Model {
    static associate(models) {
      // define association here

      TeaWeight.belongsTo(models.User, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });
    }
  }
  TeaWeight.init({
    tea_weight_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tea_weight_total: DataTypes.FLOAT,
    tea_weight_date: DataTypes.DATE,
    created_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TeaWeight',
  });
  return TeaWeight;
};