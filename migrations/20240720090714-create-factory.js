'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Factories', {
      fac_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fac_name: {
        type: Sequelize.STRING
      },
      fac_address: {
        type: Sequelize.STRING
      },
      fac_email: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // name of Target model
          key: 'user_id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
    await queryInterface.dropTable('Factories');
  }
};