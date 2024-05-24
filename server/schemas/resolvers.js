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
      const userProfile = await Profile.create({ name, email, password })

      const token = signToken(userProfile)

      return { token, userProfile }
    },

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

    addTutorial: async (parent, { title, content, category }, context) => {
      if (context.user) {
        const addTutorial = await Tutorial.create({
          title,
          content,
          author: context.user.id,
          category
        })

        const updateProfile = await Profile.findByIdAndUpdate(
          context.user.id,
          { $addToSet: { tutorials: tutorial._id } },
          { new: true, runValidators: true })

        return Tutorial.findById(tutorial._id).populate('author');

      }

      throw new AuthenticationError('Not authenticated');

    },

    removeTutorial: async (parent, { _id }, context) => {
      if (context.user) {

        const findTutorial = await Tutorial.findById(_id)

        const deleteTutorial = await Tutorial.findByIdAndDelete(_id)

        const updateProfile = await Profile.findByIdAndUpdate(Tutorial.author,
          { $pull: { tutorials: _id } })

        return tutorial
      }
      throw new AuthenticationError('Not authenticated');
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

        // Add a third argument to the resolver to access data in our `context`
        addComment: async (parent, { profileId, tutorial }, context) => {
          // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
          if (context.user) {
            return Profile.findOneAndUpdate(
              { _id: profileId },
              {
                $addToSet: { skills: skill },
              },
              {
                new: true,
                runValidators: true,
              }
            );
          }
          // If user attempts to execute this mutation and isn't logged in, throw an error
          throw AuthenticationError;
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
