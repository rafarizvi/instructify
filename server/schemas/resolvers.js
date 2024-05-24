const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const { Profile, Category, Tutorial, Comment } = require('../models');

const resolvers = {
  Query: {
    profiles: async () => {
      return Profile.find({});
    },

    profile: async (_, { _id }) => {
      return Profile.findById(_id);
    },

    tutorials: async () => {
      return Tutorial.find({}).populate('author category comments');      
    },

    categories: async () => {
      return Category.find({});
    },

    comments: async () => {
      return Comment.find({});
    }
  },

  Profile: {
    tutorials: async (parent) => {
      return Tutorial.find({ author: parent._id });
    },
    comments: async (parent) => {
      return Comment.find({ author: parent._id });
    }
  },

  Tutorial: {
    comments: async (parent) => {
      return Comment.find({ tutorial: parent._id });
    }
  },

  Category: {
    tutorials: async (parent) => {
      return Tutorial.find({ category: parent._id });
    }
  },


  Mutation: {
    addProfile: async (parent, args) => {
      const profile = await Profile.create(args);
      return profile;
    }
  }
}




module.exports = resolvers;
