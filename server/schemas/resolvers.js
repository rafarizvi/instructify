<<<<<<< HEAD
const { User, Category, Tutorial, Comment } = require('../models');

const resolvers = {
  Query: {
    user: async (_, { _id }) => {
      const params = _id ? { _id } : {};
      return User.findById(params);
    },

    tutorials: async () => {
      return Tutorial.find({});
    },

    categories: () => {
      return Category.find({});
    },

    comments: () => {
      return Comment.find({});
    }
  },

  Profile: {
    tutorials(parent) {
      return Tutorial.findById(parent._id);
    },
    comments(parent) {
      return Comment.findById(parent._id);
    }
  }

  // Tutorial: {
  //   author: (_, args, context, info) => {
  //     // Resolve the author of the tutorial

  //   },
  //   category: (_, args, context, info) => {
  //     // Resolve the category of the tutorial
  //   },
  //   comments: (_, args, context, info) => {
  //     // Resolve the comments of the tutorial
  //   }

  // },

  // Comment: {
  //   author: (_, args, context, info) => {
  //     // Resolve the author of the comment
  //   },
  //   tutorial: (_, args, context, info) => {
  //     // Resolve the tutorial of the comment
  //   }
  // }

}


module.exports = resolvers;

User, Category, Tutorial, Comment
=======
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

// Bringing in models 
const Profile = require('../models/Profile')
const Tutorial = require('../models/Tutorial')
const Comment = require('../models/Comment')
const Category = require('../models/Category')

const resolvers = {
  Query: {
    // Get all profiles and populate all comments and tutorials
    profile: async (parent, args, { _id }) => {
      return Profile.findById(_id).populate('tutorials').populate('comments');
    },
  }
}
>>>>>>> 9b7e4773b51bd244f7683773785ee1a9a08378b5
