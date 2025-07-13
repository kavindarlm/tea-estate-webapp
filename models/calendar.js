'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Calendar.belongsTo(models.User, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  }
  Calendar.init({
    cal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cal_date: DataTypes.DATE,
    cal_title: DataTypes.STRING,
    cal_note: DataTypes.TEXT,
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    modelName: 'Calendar',
  });
  return Calendar;
};