'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed commands here.
    // Example:
    await queryInterface.bulkInsert('users', [{
      user_name: 'John Doe',
      user_email: 'john@example.com',
      user_address: '1234 Main St',
      user_phone: '123-456-7890',
      user_role: 'user',
      user_nic: '123456789V',
      user_age: 30,
      user_sex: 'Male',
      password: '$2b$10$VBYFMel1JRQEfE1fgdsgrgeffdhht.h4LM2DjCXm/nAKccnK',
      deleted: false,
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
