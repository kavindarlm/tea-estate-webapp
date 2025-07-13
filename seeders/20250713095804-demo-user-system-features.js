'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all users from the database
    const users = await queryInterface.sequelize.query(
      'SELECT user_id, user_role FROM users WHERE deleted = false ORDER BY user_id',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    // Get all system features from the database
    const systemFeatures = await queryInterface.sequelize.query(
      'SELECT system_feature_id, name FROM SystemFeatures ORDER BY system_feature_id',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (users.length === 0 || systemFeatures.length === 0) {
      console.log('No users or system features found. Skipping UserSystemFeature seeding.');
      return;
    }

    // Define feature access based on user roles
    const roleFeatureMapping = {
      'user': [
        'Dashboard', 'Tea Weight', 'Calendar', 'Tea Health'
      ]
    };

    const userSystemFeatures = [];

    // Generate user-system-feature mappings
    users.forEach(user => {
      const userRole = user.user_role.toLowerCase();
      console.log(`\nProcessing user ID: ${user.user_id}, Role: "${userRole}"`);
      
      // Only process users with role 'user'
      if (userRole === 'user') {
        console.log(`User ${user.user_id} has 'user' role - assigning features`);
        
        const allowedFeatures = roleFeatureMapping['user'];
        console.log(`User ${user.user_id} gets ${allowedFeatures.length} features:`, allowedFeatures);

        allowedFeatures.forEach(featureName => {
          const feature = systemFeatures.find(f => f.name === featureName);
          if (feature) {
            userSystemFeatures.push({
              user_id: user.user_id,
              system_feature_id: feature.system_feature_id,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            console.log(`  - Added feature: ${featureName} (ID: ${feature.system_feature_id})`);
          } else {
            console.log(`  - Feature not found: ${featureName}`);
          }
        });
      } else {
        console.log(`User ${user.user_id} has '${userRole}' role - skipping (only processing 'user' role)`);
      }
    });

    // Insert the user-system-feature mappings
    if (userSystemFeatures.length > 0) {
      await queryInterface.bulkInsert('UserSystemFeatures', userSystemFeatures, {});
      console.log(`Created ${userSystemFeatures.length} user-system-feature mappings`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserSystemFeatures', null, {});
  }
};
