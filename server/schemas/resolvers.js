const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { AuthenticationError } = require('apollo-server-express');
const { signToken, AuthenticationError } = require('../utils/auth');


const {
  Profile,
  Category,
  Tutorial,
  Comment } = require('../models');
const { findByIdAndUpdate } = require('../models/Profile');

const resolvers = {
  Query: {
    profiles: async () => {
      return Profile.find({});
    },

    profile: async (_, { _id }) => {
      return Profile.findById(_id);
    },

    tutorial: async () => {
      return Tutorial.find({});
    },

    categories: async () => {
      return Category.find({});
    },

    comments: async () => {
      return Comment.find({});
    }
  },

  Profile: {
    tutorial(parent) {
      return Tutorial.findById(parent._id);
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
    tutorial(parent) {
      return Tutorial.findById(parent._id);
    }
  },

  // Creating a user using their name, email and their password.
  // Assigning signToken to profile.
  Mutation: {
    addProfile: async (parent, { name, email, password }) => {
      const userProfile = new Profile.create({ name, email, password })

      const token = signToken(userProfile)

      return { token, userProfile }
    },

    // Logging in user by their email and password.
    login: async (profile, { email, password }) => {
      const userLogin = await Profile.findOne({ email })

      if (!userLogin) {
        throw AuthenticationError('Email or password are incorrect')
      }

      const correctPwd = await userLogin.isCorrectPassword(password)

      if (!correctPwd) {
        throw AuthenticationError('Email or password are incorrect')
      }
    },

    // Adding tutorial using mutations. Using context.user for auth purposes.
    addTutorial: async (parent, { title, content, category }, context) => {

      if (context.user) {
        const tutorial = await Tutorial.create({
          title,
          content,
          author: context.user.id,
          category
        });
      
      const profile = await Profile.findByIdAndUpdate(context.user.id, 
        { $addToSet: { tutorial: tutorial._id } },
        { new: true, runValidators: true })

        return Tutorial.findById(tutorial._id).populate('author');
    }
    throw new AuthenticationError
  },

  //Removing tutorial by finding tutorial by id
    removeTutorial: async (parent, { _id }, context) => {
      if (context.user) {
        const removeTutorial = await Tutorial.findById(_id)

        const deleteTutorial = await Tutorial.findOneAndDelete(_id)

        const profile = await Profile.findByIdAndUpdate(
          { _id: context.user.id },
          { $pull: { tutorial: _id } },
          { new: true, runValidators: true })
          .populate('tutorial')

          return deleteTutorial
      }
      throw new AuthenticationError
    }
  },

  // Ability to add comments via typedefs using mutations
  addComment: async (parent, { tutorialId, content }, context) => {
    if (context.user) {
      const findTutorial = await Tutorial.findById(tutorialId)

      const addComment = await Comment.create({
        content,
        author: context.user.id,
        tutorial: tutorialId })

      const updateProfile = await findByIdAndUpdate(context.user.id, 
        { $addToSet: { comments: comments._id } },
        { new: true, runValidators: true })

      const updateTutorial = await Tutorial.findByIdAndUpdate(
        { $addToSet: { comments: comments._id } },
        { new: true, runValidators: true })

        return Comment.findById(comment.id).populate('author tutorial')
      }

      throw new AuthenticationError
  },

  // Removing user comment via typedefs using mutations
  removeComment: async (parent, { _id }, context) => {
    if (context.user) {
      const findComment = await Comment.findById(_id)

      const deleteComment = await Comment.findByIdAndDelete(_id)

      const updateProfile = await Profile.findByIdAndUpdate(comment.author,
        { $pull: { comments: comment._id } },
        { new: true, runValidators: true })

      const updateTutorial = await Tutorial.findByIdAndUpdate(comment.author, 
        { $pull: { comments: comment._id } },
        { new: true, runValidators: true })

      return comment;
    }
    throw new AuthenticationError
  }
}


module.exports = resolvers;
