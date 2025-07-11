'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserSystemFeatures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      system_feature_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SystemFeatures',
          key: 'system_feature_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Add unique constraint to prevent duplicate user-feature assignments
    await queryInterface.addIndex('UserSystemFeatures', ['user_id', 'system_feature_id'], {
      unique: true,
      name: 'unique_user_system_feature'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserSystemFeatures');
  }
};