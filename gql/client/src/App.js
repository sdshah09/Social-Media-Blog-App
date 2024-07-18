import React, { useContext,useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/authContext";

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  useEffect(() => {
    console.log('User state changed:', state.user);
  }, [state.user]);
  
  
  // Create an HTTP link that connects to the server.
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  // Use setContext to append the auth token to the headers of each request.
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from context state if it exists
    const token = user ? user.token : "";
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authtoken: token,
      },
    };
  });

  // Initialize Apollo Client with the auth link and the http link
  const client = new ApolloClient({
    link: authLink.concat(httpLink), // Chain it with the http link
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complete-registration" element={<CompleteRegistration />} />
      </Routes>
    </ApolloProvider>
  );
};

export default App;
