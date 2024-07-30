import React, { useContext, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Routes, Route } from "react-router-dom";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities";

import Home from "./pages/Home";
import Users from "./pages/Users";
import Nav from "./components/Nav";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import SingleUser from "./pages/SingleUser";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import PasswordForgot from "./pages/auth/PasswordForgot";
import SearchResult from "./components/SearchResults";
import Profile from "./pages/auth/Profile";
import Post from "./pages/post/Post";
import PostUpdate from "./pages/post/PostUpdate";
import SinglePost from "./pages/post/SinglePost";

import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;

  // 1. Create WebSocket link
  const wsLink = new GraphQLWsLink(
    createClient({
      url: process.env.REACT_APP_WS_ENDPOINT,
      options: {
        reconnect: true,
      },
    })
  );

  // 2. Create HTTP link
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  useEffect(() => {
    console.log("User state changed:", state.user);
  }, [state.user]);

  // 3. Set context for authentication
  const authLink = setContext((_, { headers }) => {
    const token = user ? user.token : "";
    return {
      headers: {
        ...headers,
        authtoken: token,
      },
    };
  });

  // 4. Concat HTTP and auth token link
  const httpAuthLink = authLink.concat(httpLink);

  // 5. Use split to split HTTP link or WebSocket link
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpAuthLink
  );

  // 6. Create new Apollo Client
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Nav />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user" element={<SingleUser />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        <Route path="/search/:query" element={<SearchResult />} />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/complete-registration"
          element={<CompleteRegistration />}
        />
        <Route
          path="/password/update"
          element={
            <PrivateRoute>
              <PasswordUpdate />
            </PrivateRoute>
          }
        />
        <Route
          path="/post/create"
          element={
            <PrivateRoute>
              <Post />
            </PrivateRoute>
          }
        />
        <Route
          path="/post/update/:postId"
          element={
            <PrivateRoute>
              <PostUpdate />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/password/forgot" element={<PasswordForgot />} />
      </Routes>
    </ApolloProvider>
  );
};

export default App;
