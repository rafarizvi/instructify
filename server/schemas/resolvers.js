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

  Tutorial: {
    author: (_, args, context, info) => {
      // Resolve the author of the tutorial
    },
    category: (_, args, context, info) => {
      // Resolve the category of the tutorial
    },
    comments: (_, args, context, info) => {
      // Resolve the comments of the tutorial
    }

  },

  Comment: {
    author: (_, args, context, info) => {
      // Resolve the author of the comment
    },
    tutorial: (_, args, context, info) => {
      // Resolve the tutorial of the comment
    }
  }
};





Mutation: {
  createMatchup: async (_, args) => {
    const matchup = await Matchup.create(args);
    return matchup;
  },
    createVote: async (_, { _id, techNum }) => {
      const vote = await Matchup.findOneAndUpdate(
        { _id },
        { $inc: { [`tech${techNum}_votes`]: 1 } },
        { new: true }
      );
      return vote;
    },
  },
};

module.exports = resolvers;

User, Category, Tutorial, Comment