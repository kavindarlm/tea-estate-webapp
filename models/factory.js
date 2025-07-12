'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Factory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Factory.belongsTo(models.User, {
        foreignKey: 'created_by',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      Factory.hasMany(models.FactoryWeight, {
        foreignKey: 'fac_id',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });
    }
  }
  Factory.init({
    fac_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fac_name: DataTypes.STRING,
    fac_address: DataTypes.STRING,
    fac_email: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Factory',
  });
  return Factory;
};