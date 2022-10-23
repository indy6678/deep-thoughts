// these are the functions tied to the query or mutation type def (perform the CRUD actions)

const { AuthenticationError } = require('apollo-server-express')
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth')

// const resolvers = {
//     Query: {
//         // series of methods
//         thoughts: async () => {
//             //return thought data in descending order
//             return Thought.find().sort({ createdAt: -1});
//         } 
//     }
//   };

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends');

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        // series of methods
        // get all thoughts
        // pass in parent as placeholder to access second argument
        thoughts: async (parent, { username }) => {
            // use ternary operator to check if username exists
            // if username exists, set params to ab object with username key set to that value
            // otherwise, return empty object
            const params = username ? { username } : {};
            // pass object (as params), empty or not, to the .find() method
            // if there is data in it, lookup for matching username performed 
            // otherwise, all data (thoughts) returned, including nested 
            return Thought.find(params).sort({ createdAt: -1 });
        },
        // get a single thought by ID, destructured _id argument value
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
        },
        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        // get a single user by username, destructured argument value
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        }
    },
    Mutation: {
        // Mongoose User model creates new user in db with whatever is passed in as the args
        addUser: async (parent, args) => {
            const user = await User.create(args);
            // add code to sign a token
            const token = signToken(user);

            // add code to return token
            return { token, user };
            // return user;
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Incorrect credentials")
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }

            // add logic to sign a token
            const token = signToken(user);
            // return user;
            return { token, user };
        },
        addThought: async (parent, args, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id } },
                    // mongo will return the updated document
                    { new: true }
                );

                return thought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }
            throw new AuthenticationError('You need to be logged in!')
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // add to the existing array (vs $push)
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged!')
        }
    }
}

module.exports = resolvers;