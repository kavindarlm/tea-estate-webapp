'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Get the user IDs from the users table
    const users = await queryInterface.sequelize.query(
      'SELECT user_id FROM users WHERE deleted = false ORDER BY user_id LIMIT 2',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );
    
    const firstUserId = users.length > 0 ? users[0].user_id : null;
    const secondUserId = users.length > 1 ? users[1].user_id : firstUserId;

    await queryInterface.bulkInsert('Calendars', [
      {
        cal_date: new Date('2025-01-15'),
        cal_title: 'Harvest Season',
        cal_note: 'Tea harvesting season begins',
        created_by: firstUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cal_date: new Date('2025-02-01'),
        cal_title: 'Quality Inspection',
        cal_note: 'Monthly quality inspection',
        created_by: firstUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cal_date: new Date('2025-02-14'),
        cal_title: 'Special Blend',
        cal_note: 'Valentine\'s Day - Special tea blend preparation',
        created_by: secondUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cal_date: new Date('2025-03-01'),
        cal_title: 'Spring Cleaning',
        cal_note: 'Spring cleaning of processing equipment',
        created_by: firstUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cal_date: new Date('2025-03-15'),
        cal_title: 'Staff Training',
        cal_note: 'Staff training on new processing techniques',
        created_by: firstUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cal_date: new Date('2025-07-13'),
        cal_title: 'Demo Day',
        cal_note: 'Calendar note functionality demo',
        created_by: firstUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cal_date: new Date('2025-07-15'),
        cal_title: 'Team Meeting',
        cal_note: 'Weekly team meeting for project updates',
        created_by: firstUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cal_date: new Date('2025-07-20'),
        cal_title: 'Quality Check',
        cal_note: 'Monthly quality assessment of tea production',
        created_by: secondUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Calendars', null, {});
  }
};
