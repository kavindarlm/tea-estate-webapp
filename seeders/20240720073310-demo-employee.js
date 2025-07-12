'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT user_id from users;`
    );

    const userRows = users[0];

    await queryInterface.bulkInsert('employees', [{
      emp_name: 'Charlie',
      emp_age: 30,
      emp_sex: 'Male',
      emp_address: '123 Main St',
      emp_nic: '123456789V',
      created_by: userRows[0].user_id,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      emp_name: 'Dana',
      emp_age: 25,
      emp_sex: 'Female',
      emp_address: '456 Elm St',
      emp_nic: '987654321V',
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
    await queryInterface.bulkDelete('employees', null, {});
  }
};
