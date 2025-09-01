'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SalaryConfigs', [{
      base_amount: 1000.00,
      minimum_kg_threshold: 30.00,
      per_kg_rate: 15.00,
      is_active: true,
      created_by: 1, // Admin user
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SalaryConfigs', null, {});
  }
};
