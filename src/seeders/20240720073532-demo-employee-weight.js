'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const employees = await queryInterface.sequelize.query(
      `SELECT emp_id from employees;`
    );

    const users = await queryInterface.sequelize.query(
      `SELECT user_id from users;`
    );

    const employeeRows = employees[0];
    const userRows = users[0];

    await queryInterface.bulkInsert('employeeweights', [
      {
        emp_weight: 55.5,
        emp_weight_date: new Date('2023-07-01'),
        emp_id: employeeRows[0].emp_id,
        created_by: userRows[0].user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        emp_weight: 60.0,
        emp_weight_date: new Date('2023-07-01'),
        emp_id: employeeRows[1].emp_id,
        created_by: userRows[0].user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        emp_weight: 58.3,
        emp_weight_date: new Date('2023-07-02'),
        emp_id: employeeRows[0].emp_id,
        created_by: userRows[0].user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        emp_weight: 62.7,
        emp_weight_date: new Date('2023-07-02'),
        emp_id: employeeRows[1].emp_id,
        created_by: userRows[0].user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employeeweights', null, {});
  }
};
