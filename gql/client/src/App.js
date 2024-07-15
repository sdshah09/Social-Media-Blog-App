import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Home from './pages/Home';
import Nav from './components/Nav';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache()
});


const App = () => {

  return (
    <ApolloProvider client={client}>
      <Nav/>
      <Home />
    </ApolloProvider>

  );
}

export default App;
