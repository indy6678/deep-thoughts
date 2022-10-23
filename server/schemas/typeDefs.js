// use this file to define every piece of data that the client can expect to work with

// import the gql tagged template function
const { gql } = require("apollo-server-express");

// create our typeDefs, use scalars (data type, string, int, etc); ID is like string, but unique; int is integer
const typeDefs = gql`
  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction] # nested array of reactions, type Reaction (typedef);
  }
  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought] # array of thoughts based on Thought typedef
    friends: [User]
  }
  type Query {
    me: User
    # these are 4 separate queries
    thoughts(username: String): [Thought] # allows us to query with or without username parameter, returning an array of thoughts
    thought(_id: ID!): Thought
    users: [User]
    user(username: String!): User # ! means the data must exist for us to query
  }
  type Mutation {
    # login() and addUser() mutations return a User object as defined above
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
  }
#   auth type returns a token and can optionally include any other user data
  type Auth {
    token: ID!
    user: User
  }
`;

// export the typeDefs
module.exports = typeDefs;
