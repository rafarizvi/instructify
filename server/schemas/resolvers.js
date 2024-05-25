const { Profile, Category, Tutorial, Comment } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    profiles: async () => {
      return Profile.find({});
    },

    profile: async (_, { _id }) => {
      return Profile.findById(_id);
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
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
      return Tutorial.find({ author: parent._id }).populate('category comments');
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

  Comment: {
    author: async (parent) => {
      return Profile.findById(parent.author);
    }
  },

  Mutation: {
    addProfile: async (parent, { name, email, password }) => {
      const profile = await Profile.create({ name, email, password });
      const token = signToken(profile);

      return { token, profile };
    },
    login: async (parent, { email, password }) => {
      const profile = await Profile.findOne({ email });

      if (!profile) {
        throw AuthenticationError;
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(profile);
      return { token, profile };
    },


    addTutorial: async (parent, { title, category, content }, context) => {
      if (context.user) {
        try {
          // Find the category by name
          const categoryDoc = await Category.findOne({ name: category });
          if (!categoryDoc) {
            throw new Error('Category not found');
          }

          // Create the new tutorial
          const newTutorial = await Tutorial.create({
            title,
            author: context.user.id,
            category: categoryDoc._id,
            content
          });

          await Profile.findByIdAndUpdate(
            context.user.id,
            { $addToSet: { tutorials: newTutorial._id } },
            { new: true, runValidators: true })

          return Tutorial.findById(newTutorial._id).populate('author');

          // return newTutorial;
        } catch (error) {
          throw new Error('Error creating tutorial: ' + error.message);
        }
      }
      throw AuthenticationError;
    },

    removeTutorial: async (parent, { _id }, context) => {
      if (context.user) {
        const findTutorial = await Tutorial.findById(_id);

        await Tutorial.findByIdAndDelete(_id)

        await Profile.findByIdAndUpdate(Tutorial.author,
          { $pull: { tutorials: _id } })

        return findTutorial
      }
      throw AuthenticationError;
    },

    updateTutorial: async (parent, { _id, title, category, content, author }, context) => {
      if (context.user) {
      try {

        const categoryDoc = await Category.findOne({ name: category });
          if (!categoryDoc) {
            throw new Error('Category not found');
          }
   
        const findTutorial = await Tutorial.findById(_id);

        // find tutorial by id and update with new values
        let update = await Tutorial.findOneAndUpdate({ _id }, { title, categoryDoc, content });
        return update;

      } catch (error) {
        throw new Error('Error creating tutorial: ' + error.message);
      }
      }
      throw AuthenticationError;
    },



    addComment: async (parent, { tutorialId, content }, context) => {
      if (context.user) {

        const findTutorial = await Tutorial.findById(tutorialId);

        const addComment = await Comment.create({
          content,
          author: context.user.id,
          tutorial: tutorialId
        })

        const updateProfile = await Profile.findByIdAndUpdate(
          context.user.id,
          { $addToSet: { comments: addComment._id } },
          { new: true, runValidators: true }
        )

        const updateTutorial = await Tutorial.findByIdAndUpdate(
          tutorialId,
          { $addToSet: { comments: addComment._id } },
          { new: true, runValidators: true })

        return Comment.findById(addComment._id).populate('author tutorial');
      }

      throw new AuthenticationError('Not authenticated');
    },


    removeComment: async (parent, { _id }, context) => {
      if (context.user) {
        const comment = await Comment.findById(_id);

        const deleteComment = await Comment.findByIdAndDelete(_id);

        const updateProfile = await Profile.findByIdAndUpdate(comment.author,
          { $pull: { comments: _id } });

        const updateTutorial = await Tutorial.findByIdAndUpdate(comment.tutorial,
          { $pull: { comments: _id } });

        return comment;
      }
      throw new AuthenticationError('Not authenticated');
    }
  }
};

module.exports = resolvers;
