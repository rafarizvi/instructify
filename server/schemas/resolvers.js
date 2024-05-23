const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const { Profile, Category, Tutorial, Comment } = require('../models');

const resolvers = {
  Query: {
    profile: async (_, { _id }) => {
      const params = _id ? { _id } : {};
      return Profile.findById(params);
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
  },

  Tutorial: {
    comments(parent) {
      return Comment.findById(parent._id);
    }
  },

  Category: {
    tutorials(parent) {
      return Tutorial.findById(parent._id);
    }
  }

}

module.exports = resolvers;
