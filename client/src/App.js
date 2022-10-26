import {ApolloProvider, ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import React from 'react';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// establish new link to GraphQL server at its /graphql endpoint
const httpLink = createHttpLink({
  // uri: 'http://localhost:3001/graphql', // changed for relative path
  uri: '/graphql',
});

// instantiate the Apollo client instance and create the connection to the API endpoint (will accept options)
// instantiate a new cache object using new InMemoryCache() (customizable to app)
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    // wrap entire JSX
    <ApolloProvider client={client}>
    <div className='flex-column justify-flex-start min-100-vh'>
      <Header />
      <div className='container'>
        <Home />
      </div>
      <Footer />
    </div>
    </ApolloProvider>
  );
}

export default App;