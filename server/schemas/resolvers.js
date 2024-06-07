const { Profile, Tutorial, Comment, Category } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    profiles: async () => Profile.find({}),
    profile: async (_, { _id }) => Profile.findById(_id).populate('likes dislikes'),
    me: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOne({ _id: context.user._id }).populate({
          path: 'tutorials',
          populate: 'category'
        });
      }
      throw new AuthenticationError('Not authenticated');
    },
    tutorial: async (parent, { _id }) => Tutorial.findById(_id).populate('author category comments videos'),
    tutorials: async () => Tutorial.find({}).populate('author category comments videos'),
    categories: async () => Category.find({}),
    comments: async () => Comment.find({}),
  },

  Profile: {
    tutorials: async (parent) => Tutorial.find({ author: parent._id }).populate('category comments videos'),
    comments: async (parent) => Comment.find({ author: parent._id }),
    likes: async (parent) => Tutorial.find({ _id: { $in: parent.likes } }),
    dislikes: async (parent) => Tutorial.find({ _id: { $in: parent.dislikes } }),
  },

  Tutorial: {
    author: async (parent) => Profile.findById(parent.author),
    comments: async (parent) => Comment.find({ tutorial: parent._id }),
    likes: async (parent) => Profile.find({ _id: { $in: parent.likes } }),
    dislikes: async (parent) => Profile.find({ _id: { $in: parent.dislikes } }),
  },
  Category: {
    tutorials: async (parent) => Tutorial.find({ category: parent._id }),
  },

  Comment: {
    author: async (parent) => Profile.findById(parent.author),
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
        throw new AuthenticationError('No profile with this email found.');
      }

      const correctPw = await profile.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password.');
      }

      const token = signToken(profile);
      return { token, profile };
    },

    addTutorial: async (parent, { title, category, content }, context) => {
      if (context.user) {
        const categoryDoc = await Category.findOne({ name: category });

        const newTutorial = await Tutorial.create({
          title,
          author: context.user._id,
          category: categoryDoc._id,
          content,
          createdAt: new Date(),
        });

        await Profile.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { tutorials: newTutorial._id } },
          { new: true, runValidators: true }
        );

        return Tutorial.findById(newTutorial._id).populate('author category');
      }
      throw new AuthenticationError('Not authenticated');
    },

    removeTutorial: async (parent, { _id }, context) => {
      if (context.user) {
        try {
          const findTutorial = await Tutorial.findById(_id);

          if (!findTutorial) {
            throw new Error('Tutorial not found');
          }

          await Tutorial.findByIdAndDelete(_id);

          await Profile.findByIdAndUpdate(
            findTutorial.author,
            { $pull: { tutorials: _id } },
            { new: true, runValidators: true }
          );

          return findTutorial;
        } catch (error) {
          console.error('Remove tutorial error:', error);
          throw new AuthenticationError('Not authenticated');
        }
      }
    },

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

    addComment: async (parent, { profileId, tutorialId, content }, context) => {
      if (context.user) {
        try {
          const addComment = await Comment.create({
            content,
            author: profileId,
            tutorial: tutorialId,
            createdAt: new Date(),
          });

          await Profile.findByIdAndUpdate(
            profileId,
            { $addToSet: { comments: addComment._id } },
            { new: true, runValidators: true }
          );

          await Tutorial.findByIdAndUpdate(
            tutorialId,
            { $addToSet: { comments: addComment._id } },
            { new: true, runValidators: true }
          );

          return addComment.populate('author tutorial');
        } catch (error) {
          console.error('Add comment error:', error);
          throw new AuthenticationError('Not authenticated');
        }
      }
    },

    removeComment: async (parent, { _id }, context) => {
      if (context.user) {
        try {
          const comment = await Comment.findById(_id);

          if (!comment) {
            throw new Error('Comment not found');
          }

          await Comment.findByIdAndDelete(_id);

          await Profile.findByIdAndUpdate(
            comment.author,
            { $pull: { comments: _id } },
            { new: true, runValidators: true }
          );

          await Tutorial.findByIdAndUpdate(
            comment.tutorial,
            { $pull: { comments: _id } },
            { new: true, runValidators: true }
          );

          return comment;
        } catch (error) {
          console.error('Remove comment error:', error);
          throw new AuthenticationError('Not authenticated');
        }
      }
    },

    likeTutorial: async (parent, { tutorialId, profileId }, context) => {
      if (context.user) {
        try {
          const findTutorial = await Tutorial.findByIdAndUpdate(
            tutorialId,
            { $addToSet: { likes: profileId }, $pull: { dislikes: profileId } },
            { new: true, runValidators: true }
          ).populate('author likes dislikes');

          await Profile.findByIdAndUpdate(
            profileId,
            { $addToSet: { likes: tutorialId }, $pull: { dislikes: tutorialId } },
            { new: true, runValidators: true }
          );

          return findTutorial;
        } catch (error) {
          console.error('There was an error liking this tutorial', error);
          throw new AuthenticationError('Not authenticated');
        }
      }
    },

    dislikeTutorial: async (parent, { tutorialId, profileId }, context) => {
      if (context.user) {
        try {
          const findTutorial = await Tutorial.findByIdAndUpdate(
            tutorialId,
            { $addToSet: { dislikes: profileId }, $pull: { likes: profileId } },
            { new: true, runValidators: true }
          ).populate('author likes dislikes');

          await Profile.findByIdAndUpdate(
            profileId,
            { $addToSet: { dislikes: tutorialId }, $pull: { likes: tutorialId } },
            { new: true, runValidators: true }
          );

          return findTutorial;
        } catch (error) {
          console.error('There was an error disliking this tutorial', error);
          throw new AuthenticationError('Not authenticated');
        }
      }
    },

    saveVideoToTutorial: async (parent, { title, videoId, thumbnail, content, tutorialId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      try {
        if (!videoId || !thumbnail) {
          throw new Error('videoId and thumbnail are required');
        }

        const tutorial = await Tutorial.findById(tutorialId);
        if (!tutorial) {
          throw new Error('Tutorial not found');
        }

        const video = {
          title,
          videoId,
          thumbnail,
          content,
        };

        tutorial.videos.push(video);
        await tutorial.save();

        const populatedTutorial = await Tutorial.findById(tutorialId)
          .populate('author')
          .populate('category')
          .populate('videos')
          .exec();

        return populatedTutorial;
      } catch (error) {
        console.error('Error saving video to tutorial:', error);
        throw new Error('Error saving video to tutorial: ' + error.message);
      }
    },

    removeVideoFromTutorial: async (parent, { tutorialId, videoId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const tutorial = await Tutorial.findById(tutorialId);
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }

      tutorial.videos = tutorial.videos.filter(video => video._id.toString() !== videoId);
      await tutorial.save();

      return Tutorial.findById(tutorialId).populate('author category videos');
    },

    giveDonation: async (parent, { amount }, context) => {
      const url = new URL(context.headers.referer).origin;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation',
            },
              unit_amount: amount * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });

      return { session: session.id };
    },
  },
};

module.exports = resolvers;
