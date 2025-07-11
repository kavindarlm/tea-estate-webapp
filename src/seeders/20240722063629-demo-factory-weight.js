'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const factories = await queryInterface.sequelize.query(
      `SELECT fac_id from factories;`
    );

    const users = await queryInterface.sequelize.query(
      `SELECT user_id from users;`
    );

    const factoryRows = factories[0];
    const userRows = users[0];

    await queryInterface.bulkInsert('factoryweights', [
      {
        fac_weight: 100.5,
        fac_weight_date: new Date('2023-07-01'),
        fac_id: factoryRows[0].fac_id,
        created_by: userRows[0].user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fac_weight: 105.0,
        fac_weight_date: new Date('2023-07-01'),
        fac_id: factoryRows[1].fac_id,
        created_by: userRows[0].user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fac_weight: 108.3,
        fac_weight_date: new Date('2023-07-02'),
        fac_id: factoryRows[0].fac_id,
        created_by: userRows[0].user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fac_weight: 112.7,
        fac_weight_date: new Date('2023-07-02'),
        fac_id: factoryRows[1].fac_id,
        created_by: userRows[0].user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('factoryweights', null, {});
  }
};
