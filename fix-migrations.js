// Run this command to fix the SequelizeMeta migration entries in your database.
//-------- node fix-migrations.js -------

const { Sequelize } = require('sequelize');
const config = require('./config/config.json').development;

async function fixMigrations() {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: console.log
  });

  try {
    // Check current state
    console.log('Current SequelizeMeta entries:');
    const [results] = await sequelize.query('SELECT * FROM SequelizeMeta ORDER BY name');
    results.forEach(row => console.log(' -', row.name));

    // Remove the problematic entries
    // Update the migration entries to remove the ones that are missing 
    console.log('\nRemoving missing migration entries...');
    const [deleteResult] = await sequelize.query(`
      DELETE FROM SequelizeMeta 
      WHERE name IN ('20250712200137-create-test-model.js', '20250712200352-remove-test-model-table.js')
    `);

    const [finalResults] = await sequelize.query('SELECT * FROM SequelizeMeta ORDER BY name');
    finalResults.forEach(row => console.log(' -', row.name));

    console.log('\nMigration entries fixed successfully!');
  } catch (error) {
    console.error('Error fixing migrations:', error);
  } finally {
    await sequelize.close();
  }
}

fixMigrations();
