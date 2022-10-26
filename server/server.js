const path = ('path');
const express = require('express');
// import ApolloServer
const {ApolloServer} = require('apollo-server-express');

// import middleware function to perform authentication check, declare first!!!
const {authMiddleware} = require('./utils/auth')

// import our typedefs and resolvers
const {typeDefs, resolvers} = require('./schemas')
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs, 
  resolvers,
  // add middleware, updated request object passed to resolvers as the context
  context: authMiddleware
});

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({app});

  // serve up static assets (client)
  if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  })

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
})
};

// call the async function to start the server
startApolloServer(typeDefs, resolvers);