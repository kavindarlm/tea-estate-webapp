'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SalaryConfigs', {
      salary_config_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      base_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Base salary amount for reaching minimum kg threshold'
      },
      minimum_kg_threshold: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 30.00,
        comment: 'Minimum kg required to earn base amount'
      },
      per_kg_rate: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        comment: 'Rate per kg for weight exceeding the threshold'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Only one config can be active at a time'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
    await queryInterface.dropTable('SalaryConfigs');
  }
};
