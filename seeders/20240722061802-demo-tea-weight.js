'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT user_id from users;`
    );

    const userRows = users[0];

    await queryInterface.bulkInsert('TeaWeights', [{
      tea_weight_total: 100,
      tea_weight_date: new Date(),
      created_by: userRows[0].user_id,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      tea_weight_total: 200,
      tea_weight_date: new Date(),
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

    await queryInterface.bulkDelete('TeaWeights', null, {});
  }
};
