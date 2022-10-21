// these are the functions tied to the query or mutation type def (perform the CRUD actions)
const { User, Thought } = require('../models');

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
    }
}

module.exports = resolvers;