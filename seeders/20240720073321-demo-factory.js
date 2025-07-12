'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT user_id from users;`
    );

    const userRows = users[0];

    await queryInterface.bulkInsert('factories', [{
      fac_name: 'Factory 1',
      fac_address: '123 Main St',
      fac_email: '123@gmail.com',
      created_by: userRows[0].user_id,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fac_name: 'Factory 2',
      fac_address: '456 Elm St',
      fac_email: 'fac2@gmail.com',
      created_by: userRows[0].user_id,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('factories', null, {});
  }
};

