'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      // define association here
      Employee.belongsTo(models.User, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      Employee.hasMany(models.EmployeeWeight, {
        foreignKey: 'emp_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  Employee.init({
    emp_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    emp_name: DataTypes.STRING,
    emp_age: DataTypes.INTEGER,
    emp_sex: DataTypes.STRING,
    emp_address: DataTypes.STRING,
    emp_nic: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};