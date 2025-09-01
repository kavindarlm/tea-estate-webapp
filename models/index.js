'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const Calendar = require('./calendar')(sequelize, Sequelize.DataTypes);
const Employee = require('./employee')(sequelize, Sequelize.DataTypes);
const EmployeeWeight = require('./employeeweight')(sequelize, Sequelize.DataTypes);
const Factory = require('./factory')(sequelize, Sequelize.DataTypes);
const FactoryWeight = require('./factoryweight')(sequelize, Sequelize.DataTypes);
const SalaryConfig = require('./salaryconfig')(sequelize, Sequelize.DataTypes);
const SystemFeature = require('./systemfeature')(sequelize, Sequelize.DataTypes);
const TeaWeight = require('./teaweight')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const UserSystemFeature = require('./usersystemfeature')(sequelize, Sequelize.DataTypes);

db.Calendar = Calendar;
db.Employee = Employee;
db.EmployeeWeight = EmployeeWeight;
db.Factory = Factory;
db.FactoryWeight = FactoryWeight;
db.SalaryConfig = SalaryConfig;
db.SystemFeature = SystemFeature;
db.TeaWeight = TeaWeight;
db.User = User;
db.UserSystemFeature = UserSystemFeature;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
