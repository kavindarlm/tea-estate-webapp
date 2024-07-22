'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed commands here.
    // Example:
    await queryInterface.bulkInsert('users', [{
      user_name: 'John Doe',
      user_email: 'john@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Add commands to revert seed here.
    // Example:
    await queryInterface.bulkDelete('users', null, {});
  }
};
