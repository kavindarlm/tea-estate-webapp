'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      user_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_nic: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_age: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      user_sex: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};