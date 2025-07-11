'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SystemFeatures', {
      system_feature_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Insert initial system features
    await queryInterface.bulkInsert('SystemFeatures', [
      { name: 'Dashboard', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tea Weight', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Employees List', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Factory List', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Reports', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Calendar', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Salary', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tea Health', createdAt: new Date(), updatedAt: new Date() },
      { name: 'User Management', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SystemFeatures');
  }
};