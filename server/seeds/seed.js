const db = require('../config/connection');
const cleanDB = require('./cleanDB');
const { Profile, Category, Tutorial, Comment } = require('../models');

const tutorialData = require('./tutorialData.json');
const categoryData = require('./categoryData.json');
const profileData = require('./profileData.json');
const commentData = require('./commentData.json');

db.once('open', async () => {
  try {
    await cleanDB('Profile', 'profiles');
    await cleanDB('Category', 'categories');
    await cleanDB('Tutorial', 'tutorials');
    await cleanDB('Comment', 'comments');

    // insert profile data
    const profiles = await Profile.insertMany(profileData);

    const profileMap = {};
    profiles.forEach(profile => {
      profileMap[profile.name] = profile._id;
    });

    // insert category data
    const categories = await Category.insertMany(categoryData);

    // insert tutorial data
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    const tutorialsToInsert = tutorialData.map(tutorial => {
      return {
        ...tutorial,
        category: categoryMap[tutorial.categoryName],
        author: profileMap[tutorial.authorName]
      };
    });
    const tutorials = await Tutorial.insertMany(tutorialsToInsert);


    const tutorialMap = {};
    tutorials.forEach(tutorial => {
      tutorialMap[tutorial.title] = tutorial._id;
    });

    const commentsToInsert = commentData.map(comment => {
      return {
        ...comment,
        author: profileMap[comment.authorName],
        tutorial: tutorialMap[comment.tutorialName]
      };
    });
    await Comment.insertMany(commentsToInsert);

    console.log('Data seeded! 🪴🪴🪴');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
});
