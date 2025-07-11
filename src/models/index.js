const Sequelize = require('sequelize');
const config = require('./../config/config.json')['development'];
const UserModel = require('./user');
const EmployeeModel = require('./employee');
const EmployeeWeightModel = require('./employeeweight');
const FactoryModel = require('./factory');
const TeaWeightModel = require('./teaweight');
const FactoryWeightModel = require('./factoryweight');
const CalendarModel = require('./calendar');
const SystemFeatureModel = require('./systemfeature');
const UserSystemFeatureModel = require('./usersystemfeature');

let sequelize;

sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = {
  User: UserModel(sequelize, Sequelize.DataTypes),
  Employee: EmployeeModel(sequelize, Sequelize.DataTypes),
  EmployeeWeight: EmployeeWeightModel(sequelize, Sequelize.DataTypes),
  Factory: FactoryModel(sequelize, Sequelize.DataTypes),
  TeaWeight: TeaWeightModel(sequelize, Sequelize.DataTypes),
  FactoryWeight: FactoryWeightModel(sequelize, Sequelize.DataTypes),
  Calendar: CalendarModel(sequelize, Sequelize.DataTypes),
  SystemFeature: SystemFeatureModel(sequelize, Sequelize.DataTypes),
  UserSystemFeature: UserSystemFeatureModel(sequelize, Sequelize.DataTypes),
};

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

  Object.values(models).forEach(model => {
    if (model.associate) {
      model.associate(models);
    }
  });

module.exports = {
  ...models,
  sequelize, // Exporting the connection
  Sequelize // Exporting the library
};