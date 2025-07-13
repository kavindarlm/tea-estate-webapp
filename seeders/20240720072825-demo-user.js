'use strict';

const bcrypt = require('bcrypt'); // ✅ Import bcrypt

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash passwords before inserting
    const hashedPassword1 = await bcrypt.hash('Password123', 10);
    const hashedPassword2 = await bcrypt.hash('AdminPass456', 10);

    await queryInterface.bulkInsert('users', [
      {
        user_name: 'John Doe',
        user_email: 'john@example.com',
        user_address: '1234 Main St, Colombo',
        user_phone: '0771234567',
        user_role: 'user',
        user_nic: '923456789V',
        user_age: 30,
        user_sex: 'Male',
        password: hashedPassword1,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_name: 'Nimesha Perera',
        user_email: 'nimesha@example.com',
        user_address: '45 Lotus Lane, Galle',
        user_phone: '0719876543',
        user_role: 'admin',
        user_nic: '993456789V',
        user_age: 28,
        user_sex: 'Female',
        password: hashedPassword2,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
