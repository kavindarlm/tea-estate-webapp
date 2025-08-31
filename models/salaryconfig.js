'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalaryConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SalaryConfig.belongsTo(models.User, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });
    }
  }
  SalaryConfig.init({
    salary_config_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    base_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    minimum_kg_threshold: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 30.00
    },
    per_kg_rate: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SalaryConfig',
  });
  return SalaryConfig;
};
