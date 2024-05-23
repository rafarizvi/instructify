const db = require('../config/connection');
const { Tech } = require('../models');
const cleanDB = require('./cleanDB');

const techData = require('./tutorialData.json');

db.once('open', async () => {
  await cleanDB('Tech', 'teches');

  await Tech.insertMany(techData);

  console.log('Technologies seeded!');
  process.exit(0);
});
