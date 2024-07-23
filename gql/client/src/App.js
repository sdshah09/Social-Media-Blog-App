import React, { useContext, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteRegistration from "./pages/auth/CompleteRegistration";

import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import PasswordForgot from "./pages/auth/PasswordForgot";

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  useEffect(() => {
    console.log("User state changed:", state.user);
  }, [state.user]);

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  const authLink = setContext((_, { headers }) => {
    const token = user ? user.token : "";
    return {
      headers: {
        ...headers,
        authtoken: token,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
        <Route 
          path="/password/forgot" 
          element={
            <PrivateRoute>
              <PasswordForgot />
            </PrivateRoute>
          } 
        />
      </Routes>
    </ApolloProvider>
  );
};

export default App;
