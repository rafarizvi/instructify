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
