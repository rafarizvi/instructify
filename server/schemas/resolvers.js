const { Profile, Category, Tutorial, Comment } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

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
        // populate  the tutorials created by the logged-in user
        return Profile.findOne({ _id: context.user._id }).populate({
          path: 'tutorials',
          populate: 'category'
        });
      }
      throw AuthenticationError;
    },
    // added query for locating single tutorial by its id and populating author, category and comments associated with it -tb
    tutorial: async (parent, { _id }) => {
      return Tutorial.findById(_id).populate('author category comments');
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
      try {
        const profile = await Profile.create({ name, email, password });
        const token = signToken(profile);
        return { token, profile };
      } catch (error) {
        if (error.code === 11000) {
          const duplicateField = Object.keys(error.keyPattern)[0];
          let errorMessage = '';
          if (duplicateField === 'email') {
            errorMessage = 'This email is already in use.';
          } else if (duplicateField === 'name') {
            errorMessage = 'This username is already in use.';
          }
          throw new Error(errorMessage);
        }
        throw new Error('An error occurred during sign up. Please try again.');
      }
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
        
          // Find the category by name
          const categoryDoc = await Category.findOne({ name: category });
          if (!categoryDoc) {
            throw new Error('You need to add a category.');
          }

          // Create the new tutorial
          const newTutorial = await Tutorial.create({
            title,
            author: context.user._id,
            category: categoryDoc._id,
            content
          });

          await Profile.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { tutorials: newTutorial._id } },
            { new: true, runValidators: true })

          return Tutorial.findById(newTutorial._id).populate('author category');

        }
  throw new AuthenticationError('Not authenticated');
},

    //! If remove mutation does not work, please remove "context" throughout the code and use "profileId" instead. Instead of context.user.id, use profile._id as well  -tb
    //! profileId and profile._id is verified to be working to remove comments

    removeTutorial: async (parent, { _id }, context) => {
      if (context.user) {
        try {
          const findTutorial = await Tutorial.findById(_id);

          await Tutorial.findByIdAndDelete(_id)

          await Profile.findByIdAndUpdate(Tutorial.author,
            { $pull: { tutorials: _id } })

          return findTutorial

        } catch (error) {
          throw new AuthenticationError('Not authenticated');
        }
      }
    },
        
    //! If remove mutation does not work, please remove "context" throughout the code and use "profileId" instead. Instead of context.user.id, use profile._id as well  -tb
    //! profileId and profile._id is verified to be working to remove comments

    updateTutorial: async (parent, { _id, title, category, content }, context) => {
      if (context.user) {
        try {
          const categoryDoc = await Category.findOne({ name: category });
          if (!categoryDoc) {
            throw new Error('Category not found');
          }
    
          const updatedTutorial = await Tutorial.findByIdAndUpdate(
            _id,
            { title, content, category: categoryDoc._id },
            { new: true }
          ).populate('category');
    
          return updatedTutorial;
        } catch (error) {
          console.error('Update tutorial error:', error);
          throw new AuthenticationError('Not authenticated');
        }
      }
    },
    

    // added profileId and removed context.user from code. Removed finding tutorial by id and instead replaced it with creating a comment and then finding and updating the tutorial. Then returning the mutation with the populated data
    addComment: async (parent, { profileId, tutorialId, content }, context) => {
      if (context.user) {
      try {

        const addComment = await Comment.create({
          content,
          author: profileId,
          tutorial: tutorialId
        })

        const updateProfile = await Profile.findByIdAndUpdate(
          profileId._id,
          { $addToSet: { comments: addComment._id } },
          { new: true, runValidators: true }
        )

        const updateTutorial = await Tutorial.findByIdAndUpdate(
          tutorialId,
          { $addToSet: { comments: addComment._id } },
          { new: true, runValidators: true })

        return addComment.populate('author tutorial');
        } catch (error) {
          throw new AuthenticationError('Not authenticated');
        }
      }
    },

    //! If remove mutation does not work, please remove "context" throughout the code and use profileId instead -tb
    //! profileId is verified to be working to remove comments

    removeComment: async (parent, { _id }, context) => {
      if (context.user) {
      try {
        const comment = await Comment.findById(_id);

        const deleteComment = await Comment.findByIdAndDelete(_id);

        const updateProfile = await Profile.findByIdAndUpdate(comment.author,
          { $pull: { comments: _id } },
          { new: true, runValidators: true })


        const updateTutorial = await Tutorial.findByIdAndUpdate(comment.tutorial,
          { $pull: { comments: _id } },
          { new: true, runValidators: true });

        return comment;

        } catch (error) {
          throw new AuthenticationError('Not authenticated');
        }
      }
    },

    updateComment: async (parent, { _id, content }, context) => {
      if (context.user) {
      try {
        // find tutorial by id and update with new values
        const updateComment = await Comment.findOneAndUpdate({ _id }, { content });

        return updateComment;

        } catch (error) {
          throw new AuthenticationError('Not authenticated');
        }
      }
    },

    // Mutation to save a video as a tutorial
    saveVideoToTutorial: async (parent, { title, videoId, thumbnail, content, c }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      try {
        if (!videoId || !thumbnail  ) {
          throw new Error('videoId, thumbnail, and category are required');
        }

        const tutorial = await Tutorial.create({
          title,
          videoId,
          thumbnail,
          content,
          author: context.user._id,
        });

        const populatedTutorial = await Tutorial.findById(tutorial._id).populate('category').exec();
        await Profile.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { tutorials: tutorial._id } },
          { new: true }
        );

        return populatedTutorial;
      } catch (error) {
        throw new Error('Error saving video to tutorial: ' + error.message);
      }
    },
  },
};





module.exports = resolvers;
