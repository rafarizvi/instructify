const { Profile, Tutorial, Category, Comment } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // Query to get a profile by ID, populated with tutorials and comments
    profile: async (_, { _id }) => {
      return Profile.findById(_id).populate('tutorials').populate('comments');
    },
    // Query to get all tutorials, populated with author, category, and comments
    tutorials: async () => {
      const tutorials = await Tutorial.find().populate('author').populate('category').populate('comments');
      return tutorials.map(tutorial => ({
        ...tutorial.toObject(),
        category: tutorial.category || { name: "Unknown" } // Handle null categories
      }));
    },
    // Query to get all categories, populated with tutorials
    categories: async () => {
      const categories = await Category.find().populate('tutorials');
      return categories.map(category => ({
        ...category.toObject(),
        name: category.name || 'Unknown' // Handle null names
      }));
    },
    // Query to get all comments, populated with author and tutorial
    comments: async () => {
      return Comment.find().populate('author').populate('tutorial');
    }
  },
  
  Mutation: {
    // Mutation to add a new profile and return a token
    addProfile: async (parent, { name, email, password }) => {
      const userProfile = await Profile.create({ name, email, password });
      const token = signToken(userProfile);
      return { token, userProfile };
    },

    // Mutation to log in a user and return a token
    login: async (parent, { email, password }) => {
      const userLogin = await Profile.findOne({ email });

      if (!userLogin) {
        throw new AuthenticationError('Email or password are incorrect');
      }

      const correctPwd = await userLogin.isCorrectPassword(password);

      if (!correctPwd) {
        throw new AuthenticationError('Email or password are incorrect');
      }
      const token = signToken(userLogin);
      return { token, user: userLogin };
    },

    // Mutation to add a new tutorial and associate it with the current user
    addTutorial: async (parent, { title, content, category }, context) => {
      if (context.user) {
        const newTutorial = await Tutorial.create({
          title,
          content,
          author: context.user._id,
          category
        });
  
        await Profile.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { tutorials: newTutorial._id } },
          { new: true, runValidators: true }
        );
  
        return Tutorial.findById(newTutorial._id).populate('author').populate('category').populate('comments');
      }

      throw new AuthenticationError('Not authenticated');
    },

    // Mutation to remove a tutorial by ID
    removeTutorial: async (parent, { _id }, context) => {
      if (context.user) {
        const tutorial = await Tutorial.findById(_id);

        if (!tutorial) {
          console.error(`Tutorial not found for ID: ${_id}`);
          throw new Error('Tutorial not found');
        }

        await Tutorial.findByIdAndDelete(_id);
        await Profile.findByIdAndUpdate(tutorial.author, { $pull: { tutorials: _id } });

        return tutorial;
      }

      throw new AuthenticationError('Not authenticated');
    },
    

    // Mutation to add a new comment to a tutorial
    addComment: async (parent, { tutorialId, content }, context) => {
      if (context.user) {
        const newComment = await Comment.create({
          content,
          author: context.user._id,
          tutorial: tutorialId
        });
  
        await Profile.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { comments: newComment._id } },
          { new: true, runValidators: true }
        );

        await Tutorial.findByIdAndUpdate(
          tutorialId,
          { $addToSet: { comments: newComment._id } },
          { new: true, runValidators: true }
        );

        return Comment.findById(newComment._id).populate('author').populate('tutorial');
      }

      throw new AuthenticationError('Not authenticated');
    },

    // Mutation to remove a comment by ID
    removeComment: async (parent, { commentId }, context) => {
      if (context.user) {  
        const comment = await Comment.findById(commentId);

        if (!comment) {
          throw new Error('Comment not found');
        }

        await Comment.findByIdAndDelete(commentId);
        await Profile.findByIdAndUpdate(comment.author, { $pull: { comments: commentId } });
        await Tutorial.findByIdAndUpdate(comment.tutorial, { $pull: { comments: commentId } });

        return comment;
      }

      throw new AuthenticationError('Not authenticated');
    }
  }
};

module.exports = resolvers;
