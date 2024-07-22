'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeWeight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmployeeWeight.belongsTo(models.Employee, {
        foreignKey: 'emp_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });

      EmployeeWeight.belongsTo(models.User, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });
    }
  }
  EmployeeWeight.init({
    emp_weight_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    emp_weight: DataTypes.FLOAT,
    emp_weight_date: DataTypes.DATE,
    emp_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'EmployeeWeight',
  });
  return EmployeeWeight;
};